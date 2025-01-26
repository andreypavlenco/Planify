import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { RoleRepository } from './repository/role.repository';
import { User } from 'src/entities/user.entity';
import { Role } from 'src/entities/role.entity';
import { RoleName } from 'src/common/enums';
import { Project } from 'src/entities/project.entity';

@Injectable()
export class RoleService {
  constructor(private readonly repository: RoleRepository) {}

  async createForUser(user: User, roleName: RoleName): Promise<Role> {
    return this.createRole(user, roleName);
  }

  async assignRoleToProject(
    user: User,
    project: Project,
    roleName: RoleName,
  ): Promise<Role> {
    return this.createRole(user, roleName, project);
  }

  async findRoleNameByUserAndProject(
    userId: number,
    projectId: number,
  ): Promise<RoleName | null> {
    return this.repository.findRoleByUserAndProject(userId, projectId);
  }

  async findRoleByUser(userId: number): Promise<RoleName | null> {
    return this.repository.findRoleByUser(userId);
  }

  private async createRole(
    user: User,
    roleName: RoleName,
    project?: Project,
  ): Promise<Role> {
    try {
      const role = new Role();
      role.user = user;
      role.project = project || null;
      role.role = roleName;

      return await this.repository.create(role);
    } catch (error) {
      console.error('Error creating role:', error);
      throw new InternalServerErrorException('Failed to create role');
    }
  }
}
