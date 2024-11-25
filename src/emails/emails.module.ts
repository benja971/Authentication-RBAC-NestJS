import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HashingService } from 'src/hashing/hashing.service';
import { ConfirmEmailNotificationHandler } from 'src/notifications/handlers/emails/confirm-email-notification-handler';
import { ResetPasswordEmailNotificationHandler } from 'src/notifications/handlers/emails/reset-password-notification-handler';
import { WelcomeEmailNotificationHandler } from 'src/notifications/handlers/emails/welcome-notification-handler';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';
import { RolesService } from 'src/roles/roles.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { EmailsService } from './emails.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule.forRoot(),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('SMTP_HOST'),
          secure: false,
          port: configService.get('SMTP_PORT'),
          auth: {
            user: configService.get('SMTP_USER'),
            pass: configService.get('SMTP_PASSWORD'),
          },
        },
        defaults: {
          from: `"${configService.get('SMTP_FROM_NAME')}" <${configService.get('SMTP_FROM_EMAIL')}>`,
        },
        template: {
          dir: `${__dirname}/templates/`,
          adapter: new HandlebarsAdapter(undefined, {
            inlineCssEnabled: true,
            inlineCssOptions: {},
          }),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  providers: [
    UsersService,
    EmailsService,
    HashingService,
    RolesService,
    NotificationsGateway,
    ConfirmEmailNotificationHandler,
    ResetPasswordEmailNotificationHandler,
    WelcomeEmailNotificationHandler,
  ],
})
export class EmailsModule {}
