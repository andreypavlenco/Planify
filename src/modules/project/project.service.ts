import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Project } from 'src/entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectRepository } from './repository/project.repository';
import { ProjectStatus, RoleName } from 'src/shared/enums';
import { UserService } from '../user/user.service';
import { RoleService } from '../role/role.service';
import { UpdateProjectDto } from './dto/update-project.dto';
import { DeleteResult } from 'typeorm';
import { WinstonLoggerService } from 'src/shared/utils/logger';
import { handleHttpException } from 'src/shared/exceptions';
import { ERROR_MESSAGES } from 'src/common/constants';
import { EmailService } from 'src/email/services/email.service';

@Injectable()
export class ProjectService {
  constructor(
    private readonly repository: ProjectRepository,
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly logger: WinstonLoggerService,
    private readonly emailService: EmailService,
  ) {}

  async create(dto: CreateProjectDto, userId: number): Promise<Project> {
    this.logger.info('Creating a new project', { dto, userId });

    try {
      const project = await this.repository.create(dto);
      this.logger.info('Project created successfully', {
        projectId: project.id,
      });

      const user = await this.userService.addUserToProject(userId, project);
      this.logger.info('User added to project', {
        userId: user.id,
        projectId: project.id,
      });

      await this.roleService.assignRoleToProject(
        user,
        project,
        RoleName.MANAGER,
      );
      this.logger.info('Role assigned to user', {
        userId: user.id,
        role: RoleName.MANAGER,
      });

      return project;
    } catch (error) {
      this.logger.error('Project creation failed', { error: error.message });
      handleHttpException(
        error,
        `${ERROR_MESSAGES.PROJECT.CREATE_FAILED}: ${error.message}`,
      );
    }
  }

  async findAll(): Promise<Project[]> {
    this.logger.info('Retrieving all projects');

    try {
      const projects = await this.repository.findAll();
      this.logger.info('Projects retrieved successfully', {
        count: projects.length,
      });

      return projects;
    } catch (error) {
      this.logger.error('Failed to retrieve projects', {
        error: error.message,
      });
      handleHttpException(
        error,
        `${ERROR_MESSAGES.PROJECT.RETRIEVE_FAILED}: ${error.message}`,
      );
    }
  }

  async findProjectWithUsersAndTasks(id: number): Promise<Project> {
    this.logger.info('Retrieving project with users and tasks', {
      projectId: id,
    });

    try {
      const project = await this.repository.findByIdWithRelations(id, [
        'tasks',
        'users',
      ]);
      this.logger.info('Project retrieved successfully', { projectId: id });

      return project;
    } catch (error) {
      this.logger.error('Failed to retrieve project', {
        projectId: id,
        error: error.message,
      });
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
    this.logger.info('Retrieving projects by status and date', {
      sortDate,
      status,
    });

    try {
      const projects = await this.repository.findProjectsByStatusAndDate(
        sortDate,
        status,
      );
      this.logger.info('Projects retrieved successfully', {
        count: projects.length,
      });

      return projects;
    } catch (error) {
      this.logger.error('Failed to retrieve projects by status and date', {
        error: error.message,
      });
      handleHttpException(
        error,
        `${ERROR_MESSAGES.PROJECT.RETRIEVE_FAILED}: ${error.message}`,
      );
    }
  }

  async findById(id: number): Promise<Project> {
    this.logger.info('Retrieving project by ID', { projectId: id });

    try {
      const project = await this.repository.findById(id);
      if (!project) {
        this.logger.warn('Project not found', { projectId: id });
        throw new NotFoundException(
          `${ERROR_MESSAGES.PROJECT.NOT_FOUND}: ID ${id}`,
        );
      }
      this.logger.info('Project retrieved successfully', { projectId: id });

      return project;
    } catch (error) {
      this.logger.error('Failed to retrieve project by ID', {
        projectId: id,
        error: error.message,
      });
      handleHttpException(
        error,
        `${ERROR_MESSAGES.PROJECT.NOT_FOUND}: ${error.message}`,
      );
    }
  }

  async update(id: number, dto: UpdateProjectDto): Promise<Project> {
    this.logger.info('Updating project', { projectId: id, updateData: dto });

    try {
      const project = await this.repository.findProjectWithUsers(id);

      if (dto.status === ProjectStatus.COMPLETED) {
        const emailUsers = project.users.map((user) => user.email);
        await this.emailService.sendProjectNotification(
          project.name,
          emailUsers,
        );
      }

      const updatedProject = await this.repository.update({
        ...project,
        ...dto,
      });
      if (!updatedProject) {
        this.logger.warn('Failed to update project - Not Found', {
          projectId: id,
        });
        throw new NotFoundException(
          `${ERROR_MESSAGES.PROJECT.NOT_FOUND}: ID ${id}`,
        );
      }
      this.logger.info('Project updated successfully', { projectId: id });

      return updatedProject;
    } catch (error) {
      this.logger.error('Failed to update project', {
        projectId: id,
        error: error.message,
      });
      handleHttpException(
        error,
        `${ERROR_MESSAGES.PROJECT.UPDATE_FAILED}: ${error.message}`,
      );
    }
  }

  async remove(id: number): Promise<DeleteResult> {
    this.logger.info('Removing project', { projectId: id });

    try {
      const project = await this.findById(id);
      const deleteResult = await this.repository.remove(project.id);
      this.logger.info('Project removed successfully', { projectId: id });

      return deleteResult;
    } catch (error) {
      this.logger.error('Failed to remove project', {
        projectId: id,
        error: error.message,
      });
      throw new InternalServerErrorException(
        `${ERROR_MESSAGES.PROJECT.DELETE_FAILED}: ${error.message}`,
      );
    }
  }
}
