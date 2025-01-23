import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';
import { Project } from 'src/entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectRepository } from './repository/project.repository';
import { ProjectStatus } from 'src/enums';
import { ERROR_MESSAGES } from 'src/common/constants/error-messages';
import { handleHttpException } from 'src/common/exceptions/handle-http.exception';

@Injectable()
export class ProjectService {
  constructor(
    @Inject('PROJECT_REPOSITORY')
    private readonly repository: ProjectRepository,
  ) {}

  async create(dto: CreateProjectDto): Promise<Project> {
    try {
      return await this.repository.create(dto);
    } catch (error) {
      throw new InternalServerErrorException(
        ERROR_MESSAGES.PROJECT.CREATE_FAILED,
      );
    }
  }
  async findAll(): Promise<Project[]> {
    try {
      return await this.repository.findAll();
    } catch (error) {
      throw new InternalServerErrorException(
        ERROR_MESSAGES.PROJECT.RETRIEVE_FAILED,
      );
    }
  }

  async findAllWithUsersAndTasks(id: number): Promise<Project> {
    try {
      return await this.repository.findOneWithUsersAndTasks(id, [
        'tasks',
        'users',
      ]);
    } catch (error) {
      throw new InternalServerErrorException(
        ERROR_MESSAGES.PROJECT.RETRIEVE_FAILED,
      );
    }
  }

  async findProjectsWithFilters(
    sortDate: 'ASC' | 'DESC',
    status?: ProjectStatus,
  ): Promise<Project[]> {
    try {
      return await this.repository.findWithFilters(sortDate, status);
    } catch (error) {
      throw new InternalServerErrorException(
        ERROR_MESSAGES.PROJECT.RETRIEVE_FAILED,
      );
    }
  }

  async findOne(id: number): Promise<Project> {
    try {
      const project = await this.repository.findOne(id);
      if (!project) {
        throw new NotFoundException(ERROR_MESSAGES.PROJECT.NOT_FOUND);
      }
      return project;
    } catch (error) {
      handleHttpException(error, ERROR_MESSAGES.PROJECT.NOT_FOUND);
    }
  }

  async update(id: number, dto: UpdateProjectDto): Promise<Project> {
    try {
      const project = await this.findOne(id);
      Object.assign(project, dto);
      return await this.repository.saveEntity(project);
    } catch (error) {
      handleHttpException(error, ERROR_MESSAGES.PROJECT.UPDATE_FAILED);
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.repository.remove(id);
    } catch (error) {
      throw new InternalServerErrorException(
        ERROR_MESSAGES.PROJECT.UPDATE_FAILED,
      );
    }
  }
}
