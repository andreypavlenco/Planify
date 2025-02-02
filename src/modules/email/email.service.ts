import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { WinstonLoggerService } from 'src/shared/utils/logger';
import { SEND_EMAIL_QUEUE } from 'src/common/constants/redis.queue';
import { format } from 'date-fns';

@Injectable()
export class EmailService {
  constructor(
    private readonly logger: WinstonLoggerService,
    @InjectQueue(SEND_EMAIL_QUEUE) private readonly emailQueue: Queue,
  ) {}

  private async queueEmailJob(
    recipients: string | string[],
    subject: string,
    template: string,
    context: object,
  ) {
    this.logger.info(`Queuing email: ${subject} to ${recipients}`);

    await this.emailQueue.add(
      'sendEmail',
      {
        recipients,
        subject,
        template,
        context,
      },
      {
        priority: 1,
      },
    );

    this.logger.info(`Email job added to queue: ${SEND_EMAIL_QUEUE}`);
  }

  async sendEmail(
    recipients: string | string[],
    subject: string,
    template: string,
    context: object,
  ) {
    await this.queueEmailJob(recipients, subject, template, context);
  }

  async sendTaskNotification(
    type: 'assigned' | 'completed',
    taskName: string,
    executorName: string,
    projectName: string,
    date: Date,
    recipients: string | string[],
    taskDescription?: string,
  ) {
    const templates = {
      assigned: 'task-assigned',
      completed: 'task-completed',
    };

    const subjects = {
      assigned: 'New Task Assigned!',
      completed: 'Task Completed!',
    };

    const context =
      type === 'assigned'
        ? {
            executorName,
            taskName,
            taskDescription,
            projectName,
            dueDate: format(new Date(date), 'MMMM dd, yyyy, h:mm a'),
          }
        : {
            executorName,
            taskName,
            projectName,
            completionDate: format(new Date(date), 'MMMM dd, yyyy, h:mm a'),
          };

    await this.sendEmail(recipients, subjects[type], templates[type], context);
  }

  async sendProjectNotification(projectName: string, recipients: string[]) {
    await this.sendEmail(
      recipients,
      'Project Completed!',
      'project-completed',
      { projectName },
    );
  }
}
