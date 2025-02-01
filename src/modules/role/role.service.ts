import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { RoleRepository } from './repository/role.repository';
import { User } from 'src/entities/user.entity';
import { Role } from 'src/entities/role.entity';
import { Project } from 'src/entities/project.entity';
import { RoleName } from 'src/shared/enums';
import { WinstonLoggerService } from 'src/shared/utils/logger';

@Injectable()
export class RoleService {
  constructor(
    private readonly repository: RoleRepository,
    private readonly logger: WinstonLoggerService,
  ) {}

  async createForUser(user: User, roleName: RoleName): Promise<Role> {
    this.logger.info('Creating role for user', { userId: user.id, roleName });
    return this.createRole(user, roleName);
  }

  async assignRoleToProject(
    user: User,
    project: Project,
    roleName: RoleName,
  ): Promise<Role> {
    this.logger.info('Assigning role to user in project', {
      userId: user.id,
      projectId: project.id,
      roleName,
    });

    return this.createRole(user, roleName, project);
  }

  async findRoleNameByUserAndProject(
    userId: number,
    projectId: number,
  ): Promise<RoleName | null> {
    this.logger.info('Finding role by user and project', {
      userId,
      projectId,
    });

    try {
      const role = await this.repository.findRoleByUserAndProject(
        userId,
        projectId,
      );
      this.logger.info('Role found', { userId, projectId, role });

      return role;
    } catch (error) {
      this.logger.error('Failed to find role by user and project', {
        userId,
        projectId,
        error: error.message,
      });
      throw new InternalServerErrorException(
        'Failed to find role by user and project',
      );
    }
  }

  async findRoleByUser(userId: number): Promise<RoleName | null> {
    this.logger.info('Finding role by user', { userId });

    try {
      const role = await this.repository.findRoleByUser(userId);
      this.logger.info('Role found for user', { userId, role });

      return role;
    } catch (error) {
      this.logger.error('Failed to find role by user', {
        userId,
        error: error.message,
      });
      throw new InternalServerErrorException('Failed to find role by user');
    }
  }

  private async createRole(
    user: User,
    roleName: RoleName,
    project?: Project,
  ): Promise<Role> {
    this.logger.info('Creating role', {
      userId: user.id,
      roleName,
      projectId: project?.id,
    });

    try {
      const role = new Role();
      role.user = user;
      role.project = project || null;
      role.role = roleName;

      const createdRole = await this.repository.create(role);
      this.logger.info('Role created successfully', {
        roleId: createdRole.id,
        userId: user.id,
        roleName,
        projectId: project?.id,
      });

      return createdRole;
    } catch (error) {
      this.logger.error('Error creating role', {
        userId: user.id,
        roleName,
        projectId: project?.id,
        error: error.message,
      });
      throw new InternalServerErrorException('Failed to create role');
    }
  }

  async findProjectManagers(projectId: number) {
    this.logger.log(`Fetching project managers for projectId: ${projectId}`);

    try {
      const managers = await this.repository.findProjectManagers(projectId);
      this.logger.log(
        `Found ${managers.length} project managers for projectId: ${projectId}`,
      );

      return managers;
    } catch (error) {
      this.logger.error(
        `Error fetching project managers for projectId: ${projectId}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to fetch project managers.',
      );
    }
  }
}
