import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { UserRepository } from './repository/user.repository';
import { ERROR_MESSAGES } from 'src/common/constants/error-messages';
import { handleHttpException } from 'src/common/exceptions/handle-http.exception';
import { CreateUserDto } from './dto/create-user.dto';
import { RoleName } from 'src/common/enums';
import { RoleService } from '../role/role.service';
import { Project } from 'src/entities/project.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly repository: UserRepository,
    private readonly roleService: RoleService,
  ) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    try {
      const user = await this.repository.create(dto);
      await this.roleService.createForUser(user, RoleName.USER);
      return user;
    } catch (error) {
      handleHttpException(error, ERROR_MESSAGES.USER.CREATE_FAILED);
    }
  }

  async findById(id: number): Promise<User> {
    try {
      const user = await this.repository.findById(id);
      if (!user) {
        throw new NotFoundException(
          `${ERROR_MESSAGES.USER.NOT_FOUND}: ID ${id}`,
        );
      }
      return user;
    } catch (error) {
      handleHttpException(error, ERROR_MESSAGES.USER.FIND_FAILED);
    }
  }

  async addUserToProject(userId: number, project: Project): Promise<User> {
    try {
      const user = await this.findById(userId);
      if (user.projects?.some((p) => p.id === project.id)) {
        throw new BadRequestException(
          ERROR_MESSAGES.USER.PROJECT_ALREADY_ASSIGNED,
        );
      }
      user.projects = [...(user.projects || []), project];
      return await this.updateUser(user.id, user);
    } catch (error) {
      handleHttpException(error, ERROR_MESSAGES.USER.ADD_TO_PROJECT_FAILED);
    }
  }

  async findByEmail(email: string): Promise<User> {
    try {
      const user = await this.repository.findByEmail(email);
      if (!user) {
        throw new NotFoundException(
          `${ERROR_MESSAGES.USER.NOT_FOUND}: Email ${email}`,
        );
      }
      return user;
    } catch (error) {
      handleHttpException(error, ERROR_MESSAGES.USER.FIND_FAILED);
    }
  }

  async doesEmailExist(email: string): Promise<boolean> {
    try {
      return await this.repository.emailExists(email);
    } catch (error) {
      handleHttpException(error, ERROR_MESSAGES.USER.CHECK_EMAIL_FAILED);
    }
  }

  async updateUser(id: number, dto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.findById(id);
      const updatedUser = { ...user, ...dto };
      return await this.repository.saveEntity(updatedUser);
    } catch (error) {
      handleHttpException(error, ERROR_MESSAGES.USER.UPDATE_FAILED);
    }
  }
}
