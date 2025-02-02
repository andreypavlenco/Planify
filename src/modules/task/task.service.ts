import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Task } from 'src/entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskRepository } from './repository/task.repository';
import { ProjectService } from '../project/project.service';
import { UserService } from '../user/user.service';
import { ActionHistoryService } from '../action-history/action-history.service';
import { DeleteResult } from 'typeorm';
import { Project } from 'src/entities/project.entity';
import { User } from 'src/entities/user.entity';
import { WinstonLoggerService } from 'src/shared/utils/logger';
import { TaskGateway } from 'src/websocket/task.gateway';
import { ACTIONS } from 'src/common/constants/actions';
import { ERROR_MESSAGES } from 'src/common/constants';
import { TaskStatus } from 'src/shared/enums';
import { handleHttpException } from 'src/shared/exceptions';
import { EmailService } from 'src/modules/email/email.service';
import { RoleService } from '../role/role.service';

@Injectable()
export class TaskService {
  constructor(
    private readonly repository: TaskRepository,
    private readonly projectService: ProjectService,
    private readonly userService: UserService,
    private readonly actionHistoryService: ActionHistoryService,
    private readonly logger: WinstonLoggerService,
    private readonly taskGateway: TaskGateway,
    private readonly emailService: EmailService,
    private readonly roleService: RoleService,
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

      if (assignee && assignee.email) {
        await this.emailService.sendTaskNotification(
          'assigned',
          task.name,
          assignee.firstName,
          project.name,
          task.deadline,
          assignee.email,
          task.description,
        );
      } else {
        this.logger.warn(`No email found for assignee ${assignee?.id}`);
      }

      this.taskGateway.notifyTaskCreated(task);

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

  async update(
    id: number,
    dto: UpdateTaskDto,
    userId: number,
    projectId: number,
  ): Promise<Task> {
    this.logger.info('Starting task update', {
      taskId: id,
      userId,
      updates: dto,
    });

    try {
      const [task, project, user] = await Promise.all([
        this.findById(id),
        this.projectService.findById(projectId),
        this.userService.findById(userId),
      ]);
      const updates: string[] = [];

      if (dto.status && dto.status !== task.status) {
        this.logStatusChange(task, dto.status);
        this.taskGateway.notifyTaskStatusUpdated(
          task.name,
          dto.status,
          project.id,
        );
        updates.push(ACTIONS.TASK.STATUS_CHANGED);
      }

      if (dto.status === TaskStatus.DONE) {
        const managers = await this.roleService.findProjectManagers(project.id);
        const managerEmails = managers.map((manager) => manager.user.email);
        await this.emailService.sendTaskNotification(
          'completed',
          task.name,
          user.lastName,
          project.name,
          task.deadline,
          managerEmails,
        );
      }

      if (dto.assigneeId && dto.assigneeId !== task.assignee?.id) {
        const assignee = await this.userService.findById(dto.assigneeId);
        await this.handleAssigneeChange(dto.assigneeId, task, updates);
        await this.emailService.sendTaskNotification(
          'assigned',
          task.name,
          user.firstName,
          project.name,
          task.deadline,
          assignee.email,
          task.description,
        );
      }

      Object.assign(task, dto);
      const updatedTask = await this.repository.update(task);
      this.logger.info('Task successfully updated', { taskId: id });

      updates.push(ACTIONS.TASK.UPDATED);
      await this.logActionHistory(updatedTask, user, project, updates);

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

  private logStatusChange(task: Task, newStatus: string): void {
    this.logger.info('Task status changed', {
      taskId: task.id,
      oldStatus: task.status,
      newStatus,
    });
  }

  private async handleAssigneeChange(
    assigneeId: number,
    task: Task,
    updates: string[],
  ): Promise<void> {
    const newAssignee = await this.userService.findById(assigneeId);
    if (!newAssignee) {
      this.logger.warn(`Assignee with ID ${assigneeId} not found`);
      return;
    }

    updates.push(ACTIONS.TASK.ASSIGNEE_CHANGED);
    this.logger.info('Task assignee changed', {
      taskId: task.id,
      oldAssigneeId: task.assignee?.id,
      newAssigneeId: assigneeId,
    });
  }

  private async logActionHistory(
    task: Task,
    user: User,
    project: Project,
    updates: string[],
  ): Promise<void> {
    try {
      await this.actionHistoryService.create(
        task,
        user,
        project,
        updates.join(', '),
      );
      this.logger.info('Action history successfully logged', {
        taskId: task.id,
        updates,
      });
    } catch (error) {
      this.logger.error('Failed to log action history', {
        taskId: task.id,
        error: error.message,
      });
    }
  }

  async remove(
    id: number,
    userId: number,
    projectId: number,
  ): Promise<DeleteResult> {
    this.logger.info('Removing task', { taskId: id, userId });

    try {
      const [task, project, user] = await Promise.all([
        this.findById(id),
        this.projectService.findById(projectId),
        this.userService.findById(userId),
      ]);
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
