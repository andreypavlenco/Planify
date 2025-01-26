import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Task } from 'src/entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskRepository } from './repository/task.repository';
import { TaskStatus } from 'src/common/enums';
import { ERROR_MESSAGES } from 'src/common/constants/error-messages';
import { handleHttpException } from 'src/common/exceptions/handle-http.exception';
import { ProjectService } from '../project/project.service';
import { UserService } from '../user/user.service';
import { ActionHistoryService } from '../action-history/action-history.service';
import { ACTIONS } from 'src/common/constants/actions';
import { DeleteResult } from 'typeorm';
import { WinstonLoggerService } from 'src/logger/winston-logger.service';

@Injectable()
export class TaskService {
  constructor(
    private readonly repository: TaskRepository,
    private readonly projectService: ProjectService,
    private readonly userService: UserService,
    private readonly actionHistoryService: ActionHistoryService,
    private readonly logger: WinstonLoggerService,
  ) {}

  async create(
    projectId: number,
    userId: number,
    dto: CreateTaskDto,
  ): Promise<Task> {
    this.logger.info('Task creation initiated', { projectId, userId, dto });

    try {
      const [project, owner, assignee] = await Promise.all([
        this.projectService.findById(projectId),
        this.userService.findById(userId),
        dto.assigneeId ? this.userService.findById(dto.assigneeId) : null,
      ]);
      this.logger.info('Project, owner, and assignee resolved', {
        projectId,
        ownerId: owner.id,
        assigneeId: assignee?.id,
      });

      const task = await this.repository.create({
        ...dto,
        project,
        owner,
        assignee,
      });
      this.logger.info('Task created successfully', { taskId: task.id });

      await this.actionHistoryService.create(
        task,
        owner,
        project,
        ACTIONS.TASK.CREATED,
      );
      this.logger.info('Task creation logged in action history', {
        taskId: task.id,
      });

      return task;
    } catch (error) {
      this.logger.error('Task creation failed', {
        projectId,
        userId,
        error: error.message,
      });
      throw new InternalServerErrorException(
        `${ERROR_MESSAGES.TASK.CREATE_FAILED} for Project ID ${projectId}: ${error.message}`,
      );
    }
  }

  async findWithFilters(
    sortDate: 'ASC' | 'DESC',
    status?: TaskStatus,
  ): Promise<Task[]> {
    this.logger.info('Finding tasks with filters', { sortDate, status });

    try {
      const tasks = await this.repository.findWithFilters(sortDate, status);
      this.logger.info('Tasks retrieved successfully', { count: tasks.length });

      return tasks;
    } catch (error) {
      this.logger.error('Task retrieval failed', {
        sortDate,
        status,
        error: error.message,
      });
      throw new InternalServerErrorException(
        `${ERROR_MESSAGES.TASK.RETRIEVE_FAILED}: ${error.message}`,
      );
    }
  }

  async findById(id: number): Promise<Task> {
    this.logger.info('Finding task by ID', { taskId: id });

    try {
      const task = await this.repository.findById(id);
      if (!task) {
        this.logger.warn('Task not found', { taskId: id });
        throw new NotFoundException(
          `${ERROR_MESSAGES.TASK.NOT_FOUND}: ID ${id}`,
        );
      }
      this.logger.info('Task found successfully', { taskId: id });

      return task;
    } catch (error) {
      this.logger.error('Task retrieval by ID failed', {
        taskId: id,
        error: error.message,
      });
      handleHttpException(
        error,
        `${ERROR_MESSAGES.TASK.NOT_FOUND}: ${error.message}`,
      );
    }
  }

  async update(id: number, dto: UpdateTaskDto, userId: number): Promise<Task> {
    this.logger.info('Updating task', { taskId: id, userId, updates: dto });

    try {
      const task = await this.findById(id);
      const project = task.project;
      const user = await this.userService.findById(userId);
      const updates: string[] = [];

      if (dto.status && dto.status !== task.status) {
        updates.push(ACTIONS.TASK.STATUS_CHANGED);
        this.logger.info('Task status changed', {
          taskId: id,
          oldStatus: task.status,
          newStatus: dto.status,
        });
      }

      if (dto.assigneeId && dto.assigneeId !== task.assignee?.id) {
        updates.push(ACTIONS.TASK.ASSIGNEE_CHANGED);
        this.logger.info('Task assignee changed', {
          taskId: id,
          oldAssigneeId: task.assignee?.id,
          newAssigneeId: dto.assigneeId,
        });
      }

      const updatedTask = await this.repository.saveEntity({ ...task, ...dto });
      this.logger.info('Task updated successfully', { taskId: id });

      await this.actionHistoryService.create(
        updatedTask,
        user,
        project,
        updates.join(', '),
      );
      this.logger.info('Task update logged in action history', {
        taskId: id,
        updates,
      });

      return updatedTask;
    } catch (error) {
      this.logger.error('Task update failed', {
        taskId: id,
        userId,
        error: error.message,
      });
      throw new InternalServerErrorException(
        `${ERROR_MESSAGES.TASK.UPDATE_FAILED}: ${error.message}`,
      );
    }
  }

  async remove(id: number, userId: number): Promise<DeleteResult> {
    this.logger.info('Removing task', { taskId: id, userId });

    try {
      const task = await this.findById(id);
      const project = task.project;
      const user = await this.userService.findById(userId);

      await this.actionHistoryService.create(
        task,
        user,
        project,
        ACTIONS.TASK.DELETED,
      );
      this.logger.info('Task deletion logged in action history', {
        taskId: id,
      });

      const deleteResult = await this.repository.remove(task.id);
      this.logger.info('Task removed successfully', { taskId: id });

      return deleteResult;
    } catch (error) {
      this.logger.error('Task removal failed', {
        taskId: id,
        userId,
        error: error.message,
      });
      throw new InternalServerErrorException(
        `${ERROR_MESSAGES.TASK.DELETE_FAILED}: ${error.message}`,
      );
    }
  }
}
