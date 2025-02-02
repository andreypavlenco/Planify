import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailConfig } from 'src/config/email.config';
import { EmailProcessor } from './email.processor';
import { BullModule } from '@nestjs/bullmq';
import { SEND_EMAIL_QUEUE } from 'src/common/constants';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: EmailConfig,
    }),
    BullModule.registerQueue({
      name: SEND_EMAIL_QUEUE,
    }),
  ],
  providers: [EmailService, EmailProcessor],
  exports: [EmailService],
})
export class EmailModule {}
