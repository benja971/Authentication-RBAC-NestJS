import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { ConfirmEmailNotificationHandler } from './handlers/emails/confirm-email-notification-handler';
import { ResetPasswordEmailNotificationHandler } from './handlers/emails/reset-password-notification-handler';
import { WelcomeEmailNotificationHandler } from './handlers/emails/welcome-notification-handler';
import { NotificationHandler } from './notification-handler.interface';
import { NotificationType } from './notification-types.enum';

@Injectable()
export class NotificationsGateway {
  private readonly logger = new Logger(NotificationsGateway.name);
  private readonly handlers: Map<NotificationType, NotificationHandler> = new Map();

  constructor(
    confirmEmailNotificationHandler: ConfirmEmailNotificationHandler,
    resetPasswordNotificationHandler: ResetPasswordEmailNotificationHandler,
    welcomeEmailNotificationHandler: WelcomeEmailNotificationHandler,
  ) {
    this.handlers.set(NotificationType.E_ConfirmEmail, confirmEmailNotificationHandler);
    this.handlers.set(NotificationType.E_ResetPassword, resetPasswordNotificationHandler);
    this.handlers.set(NotificationType.E_Welcome, welcomeEmailNotificationHandler);
  }

  async sendNotification(type: NotificationType[], user: User, message?: string): Promise<void> {
    const handlers = type.map((t) => this.handlers.get(t)).filter((handler) => handler);

    if (handlers.length === 0) {
      this.logger.error('Handler not found');
      throw new NotFoundException('Handler not found');
    }

    this.logger.log(`Sending notification to ${user.email} with message: ${message}`);
    await Promise.all(handlers.map((handler) => handler.sendNotification(user, message)));
  }
}
