import { Injectable } from '@nestjs/common';
import { EmailsService } from 'src/emails/emails.service';
import { UsersService } from 'src/users/users.service';
import { NotificationHandler } from '../../notification-handler.interface';

@Injectable()
export class ResetPasswordEmailNotificationHandler implements NotificationHandler {
  constructor(
    private readonly usersService: UsersService,
    private readonly emailsService: EmailsService,
  ) {}

  async sendNotification(userId: string, _message?: string): Promise<void> {
    const user = await this.usersService.findOneById(userId);
    await this.emailsService.sendResetPasswordEmail('token', user.email, user.username);
  }
}
