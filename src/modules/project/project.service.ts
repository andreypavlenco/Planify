import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Project } from 'src/entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectRepository } from './repository/project.repository';
import { ProjectStatus, RoleName } from 'src/common/enums';
import { ERROR_MESSAGES } from 'src/common/constants/error-messages';
import { handleHttpException } from 'src/common/exceptions/handle-http.exception';
import { UserService } from '../user/user.service';
import { RoleService } from '../role/role.service';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectService {
  constructor(
    private readonly repository: ProjectRepository,
    private readonly userService: UserService,
    private readonly roleService: RoleService,
  ) {}

  async create(dto: CreateProjectDto, userId: number): Promise<Project> {
    try {
      const project = await this.repository.create(dto);
      const user = await this.userService.addUserToProject(userId, project);
      await this.roleService.assignRoleToProject(
        user,
        project,
        RoleName.MANAGER,
      );
      return project;
    } catch (error) {
      handleHttpException(
        error,
        `${ERROR_MESSAGES.PROJECT.CREATE_FAILED}: ${error.message}`,
      );
    }
  }

  async findAll(): Promise<Project[]> {
    try {
      return await this.repository.findAll();
    } catch (error) {
      handleHttpException(
        error,
        `${ERROR_MESSAGES.PROJECT.RETRIEVE_FAILED}: ${error.message}`,
      );
    }
  }

  async findProjectWithUsersAndTasks(id: number): Promise<Project> {
    try {
      return await this.repository.findByIdWithRelations(id, [
        'tasks',
        'users',
      ]);
    } catch (error) {
      handleHttpException(
        error,
        `${ERROR_MESSAGES.PROJECT.RETRIEVE_FAILED}: ${error.message}`,
      );
    }
  }

  async findProjectsByStatusAndDate(
    sortDate: 'ASC' | 'DESC',
    status?: ProjectStatus,
  ): Promise<Project[]> {
    try {
      return await this.repository.findProjectsByStatusAndDate(
        sortDate,
        status,
      );
    } catch (error) {
      handleHttpException(
        error,
        `${ERROR_MESSAGES.PROJECT.RETRIEVE_FAILED}: ${error.message}`,
      );
    }
  }

  async findById(id: number): Promise<Project> {
    try {
      const project = await this.repository.findById(id);
      if (!project) {
        throw new NotFoundException(
          `${ERROR_MESSAGES.PROJECT.NOT_FOUND}: ID ${id}`,
        );
      }
      return project;
    } catch (error) {
      handleHttpException(
        error,
        `${ERROR_MESSAGES.PROJECT.NOT_FOUND}: ${error.message}`,
      );
    }
  }

  async update(id: number, dto: UpdateProjectDto): Promise<Project> {
    try {
      const project = await this.findById(id);
      const updatedProject = await this.repository.update({
        ...project,
        ...dto,
      });
      if (!updatedProject) {
        throw new NotFoundException(
          `${ERROR_MESSAGES.PROJECT.NOT_FOUND}: ID ${id}`,
        );
      }
      return updatedProject;
    } catch (error) {
      handleHttpException(
        error,
        `${ERROR_MESSAGES.PROJECT.UPDATE_FAILED}: ${error.message}`,
      );
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const project = await this.findById(id);
      await this.repository.remove(project.id);
    } catch (error) {
      throw new InternalServerErrorException(
        `${ERROR_MESSAGES.PROJECT.DELETE_FAILED}: ${error.message}`,
      );
    }
  }
}
