// src/shared/email.service.ts
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailsService {
  private readonly logger = new Logger(EmailsService.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendResetPasswordEmail(token: string, email: string, username: string): Promise<void> {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const url = `${frontendUrl}/reset-password?token=${token}`;

    this.logger.debug('Sending email (reset password)');

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Réinitialisation de votre mot de passe',
        template: './reset-pwd',
        context: { name: username, url },
      });
    } catch (error) {
      this.logger.error('Failed to send reset password email', error.stack);
      throw new Error('Unable to send reset password email');
    }
  }

  async sendEmailConfirmation(token: string, email: string, username: string): Promise<void> {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const url = `${frontendUrl}/confirm-account?token=${token}`;

    this.logger.debug('Sending email (confirm email)');

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Confirmation de votre adresse email',
        template: './confirm-email',
        context: { name: username, url },
      });
    } catch (error) {
      this.logger.error('Failed to send confirmation email', error.stack);
      throw new Error('Unable to send confirmation email');
    }
  }

  async sendWelcomeEmail(email: string, username: string): Promise<void> {
    this.logger.debug('Sending email (welcome)');

    const appUrl = this.configService.get<string>('FRONTEND_URL');

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Bienvenue sur notre plateforme',
        template: './welcome',
        context: { name: username, appUrl },
      });
    } catch (error) {
      this.logger.error('Failed to send welcome email', error.stack);
      throw new Error('Unable to send welcome email');
    }
  }
}
