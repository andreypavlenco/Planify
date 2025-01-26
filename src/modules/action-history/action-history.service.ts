import { Injectable } from '@nestjs/common';
import { ActionHistoryRepository } from './repository/action-history.repository';
import { ActionHistory } from 'src/entities/action-history.entity';
import { Task } from 'src/entities/task.entity';
import { User } from 'src/entities/user.entity';
import { Project } from 'src/entities/project.entity';

@Injectable()
export class ActionHistoryService {
  constructor(private readonly repository: ActionHistoryRepository) {}

  async create(
    task: Task,
    user: User,
    project: Project,
    action: string,
  ): Promise<ActionHistory> {
    try {
      return await this.repository.create({
        task,
        user,
        project,
        action,
      });
    } catch (error) {
      throw new Error(`Failed to create ActionHistory: ${error.message}`);
    }
  }

  async findByProject(projectId: number): Promise<ActionHistory[]> {
    try {
      return await this.repository.findByProject(projectId);
    } catch (error) {
      throw new Error(
        `Failed to retrieve ActionHistory for Project ID ${projectId}: ${error.message}`,
      );
    }
  }
}
