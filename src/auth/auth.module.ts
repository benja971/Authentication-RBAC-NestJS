import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailsService } from 'src/emails/emails.service';
import { HashingService } from 'src/hashing/hashing.service';
import { ConfirmEmailNotificationHandler } from 'src/notifications/handlers/emails/confirm-email-notification-handler';
import { ResetPasswordEmailNotificationHandler } from 'src/notifications/handlers/emails/reset-password-notification-handler';
import { WelcomeEmailNotificationHandler } from 'src/notifications/handlers/emails/welcome-notification-handler';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';
import { RolesService } from 'src/roles/roles.service';
import { AccessTokensService } from 'src/tokens/access_tokens.service';
import { RefreshToken } from 'src/tokens/entities/refresh_token.entity';
import { RefreshTokensService } from 'src/tokens/refresh_tokens.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, RefreshToken])],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    HashingService,
    RolesService,
    AccessTokensService,
    RefreshTokensService,
    NotificationsGateway,
    ConfirmEmailNotificationHandler,
    ResetPasswordEmailNotificationHandler,
    WelcomeEmailNotificationHandler,
    EmailsService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AuthModule {}
