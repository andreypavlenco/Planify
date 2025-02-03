import { Injectable } from '@nestjs/common';
import { ActionHistoryRepository } from './repository/action-history.repository';
import { ActionHistory } from 'src/entities/action-history.entity';
import { Task } from 'src/entities/task.entity';
import { User } from 'src/entities/user.entity';
import { Project } from 'src/entities/project.entity';
import { WinstonLoggerService } from 'src/shared/utils/logger';

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
    let logerInfo = {
      taskId: task.id,
      userId: user.id,
      projectId: project.id,
      action,
    };
    this.logger.info('Creating ActionHistory entry', {
      ...logerInfo,
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
        ...logerInfo,
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
