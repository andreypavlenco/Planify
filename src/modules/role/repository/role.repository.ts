import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { BaseCrudRepository } from 'src/common/repositories';
import { PROVIDER_TOKENS } from 'src/common/constants';
import { RoleName } from 'src/shared/enums';
import { Role } from 'src/entities/role.entity';

@Injectable()
export class RoleRepository extends BaseCrudRepository<Role> {
  constructor(
    @Inject(PROVIDER_TOKENS.ROLE)
    protected readonly repository: Repository<Role>,
  ) {
    super(repository);
  }

  findRoleByUserAndProject(
    userId: number,
    projectId: number,
  ): Promise<RoleName | null> {
    return this.findRole({ user: { id: userId }, project: { id: projectId } });
  }

  async findRoleByUser(userId: number): Promise<RoleName | null> {
    return this.findRole({ user: { id: userId } });
  }

  private async findRole(where: Record<string, any>): Promise<RoleName | null> {
    const role = await this.repository.findOne({
      where,
      select: ['id', 'role'],
    });

    return role ? role.role : null;
  }

  async findProjectManagers(projectId: number) {
    return this.repository.find({
      where: {
        project: { id: projectId },
        role: RoleName.MANAGER,
      },
      relations: ['user'],
    });
  }
}
