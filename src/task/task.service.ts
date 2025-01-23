import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';
import { Task } from 'src/entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskRepository } from './repository/task.repository';
import { TaskStatus } from 'src/enums';
import { ERROR_MESSAGES } from 'src/common/constants/error-messages';
import { handleHttpException } from 'src/common/exceptions/handle-http.exception';

@Injectable()
export class TaskService {
  constructor(
    @Inject('TASK_REPOSITORY')
    private readonly repository: TaskRepository,
  ) {}

//   async create(projectId: number, dto: CreateTaskDto): Promise<Task> {
//     try {
//       return await this.repository.create(dto);
//     } catch (error) {
//       throw new InternalServerErrorException(ERROR_MESSAGES.TASK.CREATE_FAILED);
//     }
//   }

  async findAll(): Promise<Task[]> {
    try {
      return await this.repository.findAll();
    } catch (error) {
      throw new InternalServerErrorException(
        ERROR_MESSAGES.TASK.RETRIEVE_FAILED,
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
        ERROR_MESSAGES.TASK.RETRIEVE_FAILED,
      );
    }
  }

  async findOne(id: number): Promise<Task> {
    try {
      const task = await this.repository.findOne(id);
      if (!task) {
        throw new NotFoundException(ERROR_MESSAGES.TASK.NOT_FOUND);
      }
      return task;
    } catch (error) {
      handleHttpException(error, ERROR_MESSAGES.TASK.NOT_FOUND);
    }
  }

  async update(id: number, dto: UpdateTaskDto): Promise<Task> {
    try {
      const task = await this.findOne(id);
      Object.assign(task, dto);
      return await this.repository.saveEntity(task);
    } catch (error) {
      handleHttpException(error, ERROR_MESSAGES.TASK.UPDATE_FAILED);
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.repository.remove(id);
    } catch (error) {
      throw new InternalServerErrorException(ERROR_MESSAGES.TASK.DELETE_FAILED);
    }
  }
}
