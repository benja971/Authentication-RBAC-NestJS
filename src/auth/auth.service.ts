import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { AccessTokensService } from 'src/tokens/access_tokens.service';
import { RefreshTokensService } from 'src/tokens/refresh_tokens.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { LoginUserDto } from './dto/login-auth.dto';
import { RegisterUserDto } from './dto/register-auth.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly usersService: UsersService,
    private readonly accessTokenService: AccessTokensService,
    private readonly refreshTokenService: RefreshTokensService,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    this.logger.debug(`Registering user with email: ${registerUserDto.email}`);

    // Création de l'utilisateur
    const [error, user] = await this.usersService.create(registerUserDto);

    if (error) {
      this.logger.error(`Failed to register user: ${registerUserDto.email}`);
      throw new ConflictException('User already exists or invalid data');
    }

    // Génération des tokens
    const { accessToken, refreshToken } = await this.generateTokens(user);

    // Stocker le refresh token
    this.logger.debug(`Storing refresh token for user with email: ${registerUserDto.email}`);
    await this.refreshTokenService.create(user.id, refreshToken);

    return {
      accessToken,
    };
  }

  private async generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    this.logger.debug(`Generating tokens for user with ID: ${user.id}`);

    const accessToken = this.accessTokenService.signAccessToken({
      id: user.id,
      email: user.email,
      roles: user.roles,
    });

    const refreshToken = this.accessTokenService.signRefreshToken({
      id: user.id,
      email: user.email,
      roles: user.roles,
    });

    return { accessToken, refreshToken };
  }

  async login(registerUserDto: LoginUserDto) {
    const user = await this.usersService.validateCredentials(registerUserDto);

    const refreshToken = await this.refreshTokenService.findByUserId(user.id);
    const accessToken = this.accessTokenService.signAccessToken({ id: user.id, email: user.email, roles: user.roles });

    if (!refreshToken || this.accessTokenService.verifyRefreshToken(refreshToken.token) === null) {
      const newRefreshToken = this.accessTokenService.signRefreshToken({ id: user.id, email: user.email, roles: user.roles });
      await this.refreshTokenService.create(user.id, newRefreshToken);
    } else {
      const rotatedToken = this.accessTokenService.signRefreshToken({ id: user.id, email: user.email, roles: user.roles });
      await this.refreshTokenService.update(refreshToken.id, rotatedToken);
    }

    return {
      accessToken: accessToken,
    };
  }
}
