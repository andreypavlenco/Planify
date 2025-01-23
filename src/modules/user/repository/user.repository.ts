import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { BaseCrudRepository } from 'src/common/repositories/base-crud.repository';
import { PROVIDER_TOKENS } from 'src/common/constants/provider.tokens';

@Injectable()
export class UserRepository extends BaseCrudRepository<User> {
  constructor(
    @Inject(PROVIDER_TOKENS.USER)
    protected readonly repository: Repository<User>,
  ) {
    super(repository);
  }

  findOneWithTasks(id: number, relations: string[] = []): Promise<User> {
    return this.findOne(id, relations);
  }

  findWithFilters(
    sortBy: string = 'createdAt',
    sortDirection: 'ASC' | 'DESC' = 'ASC',
    name?: string,
    role?: string,
  ): Promise<User[]> {
    const query = this.repository.createQueryBuilder('user');

    if (name) {
      query.andWhere('user.name LIKE :name', { name: `%${name}%` });
    }

    if (role) {
      query.andWhere('user.role = :role', { role });
    }

    query.orderBy(`user.${sortBy}`, sortDirection);

    return query.getMany();
  }
}
