import { Injectable } from '@nestjs/common';
import { ActionHistoryRepository } from './repository/action-history.repository';
import { ActionHistory } from 'src/database/entities/action-history.entity';
import { Task } from 'src/database/entities/task.entity';
import { User } from 'src/database/entities/user.entity';
import { Project } from 'src/database/entities/project.entity';
import { WinstonLoggerService } from 'src/core/utils/logger';

@Injectable()
export class ActionHistoryService {
  constructor(
    private readonly repository: ActionHistoryRepository,
    private readonly logger: WinstonLoggerService,
  ) {}

  async create(
    task: Task,
    user: User,
    project: Project,
    action: string,
  ): Promise<ActionHistory> {
    this.logger.info('Creating ActionHistory entry', {
      taskId: task.id,
      userId: user.id,
      projectId: project.id,
      action,
    });

    try {
      const actionHistory = await this.repository.create({
        task,
        user,
        project,
        action,
      });
      this.logger.info('ActionHistory entry created successfully', {
        actionHistoryId: actionHistory.id,
        taskId: task.id,
        userId: user.id,
      });
      return actionHistory;
    } catch (error) {
      this.logger.error('Failed to create ActionHistory entry', {
        taskId: task.id,
        userId: user.id,
        projectId: project.id,
        action,
        error: error.message,
      });
      throw new Error(`Failed to create ActionHistory: ${error.message}`);
    }
  }

  async findByProject(projectId: number): Promise<ActionHistory[]> {
    this.logger.info('Retrieving ActionHistory entries for project', {
      projectId,
    });

    try {
      const actionHistories = await this.repository.findByProject(projectId);
      this.logger.info('ActionHistory entries retrieved successfully', {
        projectId,
        count: actionHistories.length,
      });

      return actionHistories;
    } catch (error) {
      this.logger.error(
        'Failed to retrieve ActionHistory entries for project',
        {
          projectId,
          error: error.message,
        },
      );
      throw new Error(
        `Failed to retrieve ActionHistory for Project ID ${projectId}: ${error.message}`,
      );
    }
  }
}
