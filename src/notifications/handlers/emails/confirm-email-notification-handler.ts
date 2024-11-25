import { Injectable } from '@nestjs/common';
import { EmailsService } from 'src/emails/emails.service';
import { User } from 'src/users/entities/user.entity';
import { NotificationHandler } from '../../notification-handler.interface';

@Injectable()
export class ConfirmEmailNotificationHandler implements NotificationHandler {
  constructor(private readonly emailsService: EmailsService) {}
  async sendNotification(user: User, _message?: string): Promise<void> {
    await this.emailsService.sendEmailConfirmation(user.emailConfirmationToken, user.email, user.username);
  }
}
