import { Injectable, Logger } from '@nestjs/common';
import { NotificationType } from 'src/notifications/notification-types.enum';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';
import { AccessTokensService } from 'src/tokens/access_tokens.service';
import { RefreshTokensService } from 'src/tokens/refresh_tokens.service';
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
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<void> {
    this.logger.debug(`Registering user with email: ${registerUserDto.email}`);

    // Création de l'utilisateur
    const user = await this.usersService.create(registerUserDto);

    this.logger.debug(`User registered with ID: ${user.id}`);

    // envoi de l'email de confirmation
    const notifications: NotificationType[] = [NotificationType.E_ConfirmEmail];
    await this.notificationsGateway.sendNotification(notifications, user);
  }

  async login(registerUserDto: LoginUserDto): Promise<{ accessToken: string }> {
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
