import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailsService } from 'src/emails/emails.service';
import { HashingService } from 'src/hashing/hashing.service';
import { ConfirmEmailNotificationHandler } from 'src/notifications/handlers/emails/confirm-email-notification-handler';
import { ResetPasswordEmailNotificationHandler } from 'src/notifications/handlers/emails/reset-password-notification-handler';
import { WelcomeEmailNotificationHandler } from 'src/notifications/handlers/emails/welcome-notification-handler';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';
import { RolesService } from 'src/roles/roles.service';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
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
export class UsersModule {}
