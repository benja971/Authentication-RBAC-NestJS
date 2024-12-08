import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtUserDto } from 'src/commons/types';
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
    this.logger.verbose(`Registering user with email: ${registerUserDto.email}`);

    // Création de l'utilisateur
    const user = await this.usersService.create(registerUserDto);

    this.logger.verbose(`User registered with ID: ${user.id}`);

    // envoi de l'email de confirmation
    const notifications: NotificationType[] = [NotificationType.E_ConfirmEmail];
    await this.notificationsGateway.sendNotification(notifications, user);
  }

  async login(loginUserSto: LoginUserDto): Promise<{ accessToken: string }> {
    this.logger.verbose(`Login user with email: ${loginUserSto.email}`);

    // Vérification des informations de connexion
    const user = await this.usersService.validateCredentials(loginUserSto);

    // Génération des tokens
    const accessToken = this.accessTokenService.generate(user);
    const refreshToken = this.refreshTokenService.generate(user);

    // Sauvegarde du refresh token
    await this.refreshTokenService.create(user.id, refreshToken);

    return {
      accessToken,
    };
  }

  async logout(userId: string): Promise<void> {
    this.logger.verbose(`Logout user with ID: ${userId}`);

    // Suppression du refresh token
    await this.refreshTokenService.deleteByUser(userId);
  }

  async refresh(jwtUserDto: JwtUserDto): Promise<{ accessToken: string }> {
    this.logger.verbose(`Refresh token for user with ID: ${jwtUserDto.id}`);

    // Récupération du refresh token
    const refreshToken = await this.refreshTokenService.findByUserId(jwtUserDto.id);

    // Vérification du refresh token
    if (!this.refreshTokenService.verify(refreshToken.token)) {
      this.logger.error(`Invalid refresh token for user with ID: ${jwtUserDto.id}`);
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Génération d'un nouveau access token
    const accessToken = this.accessTokenService.generate(jwtUserDto);

    return {
      accessToken,
    };
  }
}
