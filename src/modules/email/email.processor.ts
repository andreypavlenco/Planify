import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { WinstonLoggerService } from 'src/shared/utils/logger';
import { SEND_EMAIL_QUEUE } from 'src/common/constants/redis.queue';

@Processor(SEND_EMAIL_QUEUE)
@Injectable()
export class EmailProcessor extends WorkerHost {
  constructor(
    private readonly mailerService: MailerService,
    private readonly logger: WinstonLoggerService,
  ) {
    super();
  }

  async process(job: Job): Promise<void> {
    const { recipients, subject, template, context } = job.data;
    console.log('job', job.data);
    this.logger.info(`Processing email job: ${job.id} for ${recipients}`);
    try {
      await this.mailerService.sendMail({
        to: recipients,
        subject,
        template,
        context,
      });
      this.logger.info(`Email sent successfully for job: ${job.id}`);
    } catch (error) {
      this.logger.error(`Failed to send email for job: ${job.id}`, error.stack);
      throw error;
    }
  }
}
