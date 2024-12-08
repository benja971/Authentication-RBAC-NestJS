// src/shared/email.service.ts
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailsService {
  private readonly logger = new Logger(EmailsService.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendResetPasswordEmail(token: string, email: string, username: string): Promise<void> {
    this.logger.log('Sending email (reset password)');

    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const url = `${frontendUrl}/reset-password?token=${token}`;

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Réinitialisation de votre mot de passe',
        template: './reset-pwd',
        context: { name: username, url },
      });
    } catch (error) {
      this.logger.error('Failed to send reset password email');
      throw new InternalServerErrorException('Unable to send reset password email');
    }
  }

  async sendEmailConfirmation(token: string, email: string, username: string): Promise<void> {
    this.logger.log('Sending email (confirm email)');

    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const url = `${frontendUrl}/confirm-account?token=${token}`;

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Confirmation de votre adresse email',
        template: './confirm-email',
        context: { name: username, url },
      });
    } catch (error) {
      this.logger.error('Failed to send confirmation email');
      throw new InternalServerErrorException('Unable to send confirmation email');
    }
  }

  async sendWelcomeEmail(email: string, username: string): Promise<void> {
    this.logger.log('Sending email (welcome)');

    const appUrl = this.configService.get<string>('FRONTEND_URL');

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Bienvenue sur notre plateforme',
        template: './welcome',
        context: { name: username, appUrl },
      });
    } catch (error) {
      this.logger.error('Failed to send welcome email');
      throw new InternalServerErrorException('Unable to send welcome email');
    }
  }
}
