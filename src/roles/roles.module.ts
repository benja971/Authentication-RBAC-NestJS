import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailsService } from 'src/emails/emails.service';
import { HashingService } from 'src/hashing/hashing.service';
import { ConfirmEmailNotificationHandler } from 'src/notifications/handlers/emails/confirm-email-notification-handler';
import { ResetPasswordEmailNotificationHandler } from 'src/notifications/handlers/emails/reset-password-notification-handler';
import { WelcomeEmailNotificationHandler } from 'src/notifications/handlers/emails/welcome-notification-handler';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';
import { RefreshToken } from 'src/tokens/entities/refresh_token.entity';
import { RefreshTokensService } from 'src/tokens/refresh_tokens.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { RolesController } from './roles.controller';
import { RolesGuard } from './roles.guard';
import { RolesService } from './roles.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, RefreshToken])],
  controllers: [RolesController],
  providers: [
    RolesService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    UsersService,
    HashingService,
    NotificationsGateway,
    ConfirmEmailNotificationHandler,
    ResetPasswordEmailNotificationHandler,
    WelcomeEmailNotificationHandler,
    EmailsService,
    RefreshTokensService,
  ],
})
export class RolesModule {}
