import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { UserRepository } from './repository/user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { RoleName } from 'src/shared/enums';
import { RoleService } from '../role/role.service';
import { Project } from 'src/entities/project.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { WinstonLoggerService } from 'src/shared/utils/logger';
import { handleHttpException } from 'src/shared/exceptions';
import { ERROR_MESSAGES } from 'src/common/constants';

@Injectable()
export class UserService {
  constructor(
    private readonly repository: UserRepository,
    private readonly roleService: RoleService,
    private readonly logger: WinstonLoggerService,
  ) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    this.logger.info('Creating user', { dto });

    try {
      const user = await this.repository.create(dto);
      this.logger.info('User created successfully', { userId: user.id });

      await this.roleService.createForUser(user, RoleName.USER);
      this.logger.info('Default role assigned to user', {
        userId: user.id,
        role: RoleName.USER,
      });

      return user;
    } catch (error) {
      this.logger.error('Failed to create user', { dto, error: error.message });
      handleHttpException(error, ERROR_MESSAGES.USER.CREATE_FAILED);
    }
  }

  async findById(id: number): Promise<User> {
    this.logger.info('Finding user by ID', { userId: id });

    try {
      const user = await this.repository.findById(id);
      if (!user) {
        this.logger.warn('User not found', { userId: id });
        throw new NotFoundException(
          `${ERROR_MESSAGES.USER.NOT_FOUND}: ID ${id}`,
        );
      }
      this.logger.info('User found successfully', { userId: id });

      return user;
    } catch (error) {
      this.logger.error('Failed to find user by ID', {
        userId: id,
        error: error.message,
      });
      handleHttpException(error, ERROR_MESSAGES.USER.FIND_FAILED);
    }
  }

  async addUserToProject(userId: number, project: Project): Promise<User> {
    this.logger.info('Adding user to project', {
      userId,
      projectId: project.id,
    });

    try {
      const user = await this.findById(userId);
      if (user.projects?.some((p) => p.id === project.id)) {
        this.logger.warn('User is already assigned to the project', {
          userId,
          projectId: project.id,
        });
        throw new BadRequestException(
          ERROR_MESSAGES.USER.PROJECT_ALREADY_ASSIGNED,
        );
      }

      user.projects = [...(user.projects || []), project];
      const updatedUser = await this.updateUser(user.id, user);
      this.logger.info('User added to project successfully', {
        userId,
        projectId: project.id,
      });

      return updatedUser;
    } catch (error) {
      this.logger.error('Failed to add user to project', {
        userId,
        projectId: project.id,
        error: error.message,
      });
      handleHttpException(error, ERROR_MESSAGES.USER.ADD_TO_PROJECT_FAILED);
    }
  }

  async findByEmail(email: string): Promise<User> {
    this.logger.info('Finding user by email', { email });

    try {
      const user = await this.repository.findByEmail(email);
      if (!user) {
        this.logger.warn('User not found by email', { email });
        throw new NotFoundException(
          `${ERROR_MESSAGES.USER.NOT_FOUND}: Email ${email}`,
        );
      }
      this.logger.info('User found successfully by email', {
        email,
        userId: user.id,
      });

      return user;
    } catch (error) {
      this.logger.error('Failed to find user by email', {
        email,
        error: error.message,
      });
      handleHttpException(error, ERROR_MESSAGES.USER.FIND_FAILED);
    }
  }

  async doesEmailExist(email: string): Promise<boolean> {
    this.logger.info('Checking if email exists', { email });

    try {
      const exists = await this.repository.emailExists(email);
      this.logger.info('Email existence check completed', { email, exists });

      return exists;
    } catch (error) {
      this.logger.error('Failed to check email existence', {
        email,
        error: error.message,
      });
      handleHttpException(error, ERROR_MESSAGES.USER.CHECK_EMAIL_FAILED);
    }
  }

  async updateUser(id: number, dto: UpdateUserDto): Promise<User> {
    this.logger.info('Updating user', { userId: id, updates: dto });

    try {
      const user = await this.findById(id);
      const updatedUser = { ...user, ...dto };
      const savedUser = await this.repository.saveEntity(updatedUser);
      this.logger.info('User updated successfully', { userId: id });

      return savedUser;
    } catch (error) {
      this.logger.error('Failed to update user', {
        userId: id,
        error: error.message,
      });
      handleHttpException(error, ERROR_MESSAGES.USER.UPDATE_FAILED);
    }
  }
}
