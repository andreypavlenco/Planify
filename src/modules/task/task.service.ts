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

@Injectable()
export class TaskService {
  constructor(
    private readonly repository: TaskRepository,
    private readonly projectService: ProjectService,
    private readonly userService: UserService,
    private readonly actionHistoryService: ActionHistoryService,
  ) {}

  async create(
    projectId: number,
    userId: number,
    dto: CreateTaskDto,
  ): Promise<Task> {
    try {
      const [project, owner, assignee] = await Promise.all([
        this.projectService.findById(projectId),
        this.userService.findById(userId),
        dto.assigneeId ? this.userService.findById(dto.assigneeId) : null,
      ]);
      const task = await this.repository.create({
        ...dto,
        project,
        owner,
        assignee,
      });
      await this.actionHistoryService.create(
        task,
        owner,
        project,
        ACTIONS.TASK.CREATED,
      );
      return task;
    } catch (error) {
      throw new InternalServerErrorException(
        `${ERROR_MESSAGES.TASK.CREATE_FAILED} for Project ID ${projectId}: ${error.message}`,
      );
    }
  }

  async findWithFilters(
    sortDate: 'ASC' | 'DESC',
    status?: TaskStatus,
  ): Promise<Task[]> {
    try {
      return await this.repository.findWithFilters(sortDate, status);
    } catch (error) {
      throw new InternalServerErrorException(
        `${ERROR_MESSAGES.TASK.RETRIEVE_FAILED}: ${error.message}`,
      );
    }
  }

  async findById(id: number): Promise<Task> {
    try {
      const task = await this.repository.findById(id);
      if (!task) {
        throw new NotFoundException(
          `${ERROR_MESSAGES.TASK.NOT_FOUND}: ID ${id}`,
        );
      }
      return task;
    } catch (error) {
      handleHttpException(
        error,
        `${ERROR_MESSAGES.TASK.NOT_FOUND}: ${error.message}`,
      );
    }
  }

  async update(id: number, dto: UpdateTaskDto, userId: number): Promise<Task> {
    try {
      const task = await this.findById(id);
      const project = task.project;
      const user = await this.userService.findById(userId);
      const updates: string[] = [];

      if (dto.status && dto.status !== task.status) {
        updates.push(ACTIONS.TASK.STATUS_CHANGED);
      }

      if (dto.assigneeId && dto.assigneeId !== task.assignee?.id) {
        updates.push(ACTIONS.TASK.ASSIGNEE_CHANGED);
      }

      const updateTask = await this.repository.saveEntity({ ...task, ...dto });

      await this.actionHistoryService.create(
        updateTask,
        user,
        project,
        updates.join(', '),
      );
      return updateTask;
    } catch (error) {
      throw new InternalServerErrorException(
        `${ERROR_MESSAGES.TASK.UPDATE_FAILED}: ${error.message}`,
      );
    }
  }

  async remove(id: number, userId: number): Promise<DeleteResult> {
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

      return await this.repository.remove(task.id);
    } catch (error) {
      throw new InternalServerErrorException(
        `${ERROR_MESSAGES.TASK.DELETE_FAILED}: ${error.message}`,
      );
    }
  }
}
