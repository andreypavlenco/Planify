import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { WinstonLoggerService } from 'src/shared/utils/logger';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly logger: WinstonLoggerService,
  ) {}

  private async sendEmail(
    recipients: string | string[],
    subject: string,
    template: string,
    context: object,
  ) {
    this.logger.info(`Sending email: ${subject} to ${recipients}`);

    try {
      await this.mailerService.sendMail({
        to: recipients,
        subject,
        template,
        context,
      });

      this.logger.info(`Email sent successfully: ${subject}`);
    } catch (error) {
      this.logger.error(`Failed to send email: ${subject}`, error.stack);
    }
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
            dueDate: date,
          }
        : { executorName, taskName, projectName, completionDate: date };

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
