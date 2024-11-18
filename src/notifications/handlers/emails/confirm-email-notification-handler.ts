import { Injectable } from '@nestjs/common';
import { EmailsService } from 'src/emails/emails.service';
import { UsersService } from 'src/users/users.service';
import { NotificationHandler } from '../../notification-handler.interface';

@Injectable()
export class ConfirmEmailNotificationHandler implements NotificationHandler {
  constructor(
    private readonly usersService: UsersService,
    private readonly emailsService: EmailsService,
  ) {}
  async sendNotification(userId: string, _message?: string): Promise<void> {
    const user = await this.usersService.findOneById(userId);
    await this.emailsService.sendEmailConfirmation(user.emailConfirmationToken, user.email, user.username);
  }
}
