import { Injectable, NotFoundException } from '@nestjs/common';
import { WinstonLoggerService } from 'src/shared/utils/logger';
import { ProjectRepository } from '../project/repository/project.repository';
import { handleHttpException } from 'src/shared/exceptions';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly logger: WinstonLoggerService,
  ) {}

  async getTaskCountByStatus(projectId: number): Promise<
    {
      status: string;
      count: number;
      tasks: { taskName: string; assigneeName: string | null }[];
    }[]
  > {
    try {
      this.logger.info(
        `Fetching task count by status for project ${projectId}`,
      );

      const project = await this.projectRepository.fetchTaskSummary(projectId);

      if (!project) {
        this.logger.warn(`Project with ID ${projectId} not found`);
        throw new NotFoundException(`Project with ID ${projectId} not found`);
      }

      const statusCounts = project.tasks.reduce(
        (acc, task) => {
          if (!acc[task.status]) {
            acc[task.status] = { count: 0, tasks: [] };
          }

          acc[task.status].count += 1;
          acc[task.status].tasks.push({
            taskName: task.name,
            assigneeName: task.assignee ? task.assignee.firstName : null,
          });

          return acc;
        },
        {} as Record<
          string,
          {
            count: number;
            tasks: { taskName: string; assigneeName: string | null }[];
          }
        >,
      );

      this.logger.info(
        `Successfully fetched task count by status for project ${projectId}`,
      );

      return Object.keys(statusCounts).map((status) => ({
        status,
        count: statusCounts[status].count,
        tasks: statusCounts[status].tasks,
      }));
    } catch (error) {
      this.logger.error(
        `Failed to get task count by status for project ${projectId}: ${error.message}`,
      );
      handleHttpException(
        error,
        `Error fetching task count by status: ${error.message}`,
      );
    }
  }

  async getAverageTaskCompletionTime(projectId: number): Promise<number> {
    try {
      this.logger.info(
        `Fetching average task completion time for project ${projectId}`,
      );

      const project = await this.projectRepository.fetchTaskSummary(projectId);

      if (!project || project.tasks.length === 0) {
        this.logger.warn(`No tasks found for project ${projectId}`);
        return 0;
      }

      const totalCompletionTime = project.tasks.reduce((acc, task) => {
        const createdAt = new Date(task.createdAt).getTime();
        const completedAt = new Date(task.deadline).getTime();
        return acc + (completedAt - createdAt);
      }, 0);

      const averageTime = totalCompletionTime / project.tasks.length;

      this.logger.info(
        `Successfully fetched average task completion time for project ${projectId}`,
      );
      return averageTime / (1000 * 60 * 60);
    } catch (error) {
      this.logger.error(
        `Failed to get average task completion time for project ${projectId}: ${error.message}`,
      );
      handleHttpException(
        error,
        `Error fetching average task completion time: ${error.message}`,
      );
    }
  }

  async getTopActiveUsers(
    projectId: number,
  ): Promise<{ userId: number; name: string; taskCount: number }[]> {
    try {
      this.logger.info(`Fetching top active users for project ${projectId}`);

      const project = await this.projectRepository.fetchTaskSummary(projectId);

      if (!project) {
        this.logger.warn(`Project with ID ${projectId} not found`);
        throw new NotFoundException(`Project with ID ${projectId} not found`);
      }

      const userTaskCount: Record<
        number,
        { userId: number; name: string; taskCount: number }
      > = {};

      project.tasks.forEach((task) => {
        if (task.assignee) {
          const userId = task.assignee.id;
          if (!userTaskCount[userId]) {
            userTaskCount[userId] = {
              userId,
              name: task.assignee.lastName,
              taskCount: 0,
            };
          }
          userTaskCount[userId].taskCount++;
        }
      });

      const topUsers = Object.values(userTaskCount)
        .sort((a, b) => b.taskCount - a.taskCount)
        .slice(0, 3);

      this.logger.info(
        `Successfully fetched top active users for project ${projectId}`,
      );
      return topUsers;
    } catch (error) {
      this.logger.error(
        `Failed to get top active users for project ${projectId}: ${error.message}`,
      );
      handleHttpException(
        error,
        `Error fetching top active users: ${error.message}`,
      );
    }
  }
}
