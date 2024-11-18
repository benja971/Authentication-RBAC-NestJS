import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfirmEmailNotificationHandler } from './handlers/emails/confirm-email-notification-handler';
import { ResetPasswordEmailNotificationHandler } from './handlers/emails/reset-password-notification-handler';
import { WelcomeEmailNotificationHandler } from './handlers/emails/welcome-notification-handler';
import { NotificationHandler } from './notification-handler.interface';
import { NotificationType } from './notification-types.enum';

@Injectable()
export class NotificationsGateway {
  private readonly handlers: Map<NotificationType, NotificationHandler> = new Map();

  constructor(
    private readonly confirmEmailNotificationHandler: ConfirmEmailNotificationHandler,
    private readonly resetPasswordNotificationHandler: ResetPasswordEmailNotificationHandler,
    private readonly welcomeEmailNotificationHandler: WelcomeEmailNotificationHandler,
  ) {
    this.handlers.set(NotificationType.E_ConfirmEmail, confirmEmailNotificationHandler);
    this.handlers.set(NotificationType.E_ResetPassword, resetPasswordNotificationHandler);
    this.handlers.set(NotificationType.E_Welcome, welcomeEmailNotificationHandler);
  }

  async sendNotification(type: NotificationType[], userId: string, message?: string): Promise<void> {
    const handlers = type.map((t) => this.handlers.get(t)).filter((handler) => handler);

    if (handlers.length === 0) {
      throw new NotFoundException('Handler not found');
    }

    await Promise.all(handlers.map((handler) => handler.sendNotification(userId, message)));
  }
}