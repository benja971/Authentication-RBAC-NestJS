import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailsService } from 'src/emails/emails.service';
import { HashingService } from 'src/hashing/hashing.service';
import { RolesService } from 'src/roles/roles.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { ConfirmEmailNotificationHandler } from './handlers/emails/confirm-email-notification-handler';
import { ResetPasswordEmailNotificationHandler } from './handlers/emails/reset-password-notification-handler';
import { WelcomeEmailNotificationHandler } from './handlers/emails/welcome-notification-handler';
import { NotificationsGateway } from './notifications.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [],
  providers: [
    UsersService,
    HashingService,
    RolesService,
    EmailsService,
    NotificationsGateway,
    ConfirmEmailNotificationHandler,
    ResetPasswordEmailNotificationHandler,
    WelcomeEmailNotificationHandler,
  ],
})
export class NotificationsModule {}
