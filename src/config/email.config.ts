import { ConfigService } from '@nestjs/config';
import { MailerOptions } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

export const EmailConfig = async (
  configService: ConfigService,
): Promise<MailerOptions> => {
  return {
    transport: {
      host: configService.get<string>('EMAIL_HOST'),
      port: configService.get<number>('EMAIL_PORT'),
      secure: false,
      auth: {
        user: configService.get<string>('EMAIL_USER'),
        pass: configService.get<string>('EMAIL_PASS'),
      },
    },
    defaults: {
      from: `"${configService.get<string>('EMAIL_FROM_NAME')}" <${configService.get<string>('MAIL_FROM_ADDRESS')}>`,
    },
    template: {
      dir: process.cwd() + '/src/email/templates/',
      adapter: new EjsAdapter(),
      options: {
        strict: false,
      },
    },
  };
};
