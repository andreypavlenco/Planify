import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { BaseCrudRepository } from 'src/common/repositories/base-crud.repository';
import { Role } from 'src/entities/role.entity';
import { PROVIDER_TOKENS } from 'src/common/providers';
import { RoleName } from 'src/common/enums';

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

  findRoleByUser(userId: number): Promise<RoleName | null> {
    return this.findRole({ user: { id: userId } });
  }

  private async findRole(where: Record<string, any>): Promise<RoleName | null> {
    const role = await this.repository.findOne({
      where,
      select: ['id', 'role'],
    });
    return role.role;
  }
}
