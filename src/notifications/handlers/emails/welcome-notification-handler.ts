import { Injectable } from '@nestjs/common';
import { EmailsService } from 'src/emails/emails.service';
import { User } from 'src/users/entities/user.entity';
import { NotificationHandler } from '../../notification-handler.interface';

@Injectable()
export class WelcomeEmailNotificationHandler implements NotificationHandler {
  constructor(private readonly emailsService: EmailsService) {}
  async sendNotification(user: User, _message?: string): Promise<void> {
    await this.emailsService.sendWelcomeEmail(user.email, user.username);
  }
}
