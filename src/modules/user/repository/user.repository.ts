import { Injectable, Inject } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { BaseCrudRepository } from 'src/common/repositories/base-crud.repository';
import { PROVIDER_TOKENS } from 'src/common/providers/provider.tokens';

@Injectable()
export class UserRepository extends BaseCrudRepository<User> {
  constructor(
    @Inject(PROVIDER_TOKENS.USER)
    protected readonly repository: Repository<User>,
  ) {
    super(repository);
  }

  async findUserWithRelations(
    id: number,
    relations: string[] = [],
  ): Promise<User> {
    return this.findById(id, relations);
  }

  async findWithFilters(
    filters: { name?: string; role?: string },
    sortBy: keyof User = 'createdAt',
    sortDirection: 'ASC' | 'DESC' = 'ASC',
  ): Promise<User[]> {
    const validSortFields: Array<keyof User> = [
      'id',
      'createdAt',
      'updatedAt',
      'firstName',
      'lastName',
      'email',
    ];
    if (!validSortFields.includes(sortBy)) {
      throw new Error(`Invalid sort field: ${sortBy}`);
    }

    const where: Record<string, any> = {};
    if (filters.name) {
      where.name = Like(`%${filters.name}%`);
    }
    if (filters.role) {
      where.role = filters.role;
    }

    return this.repository.find({
      where,
      order: { [sortBy]: sortDirection },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOneBy({ email });
  }

  async emailExists(email: string): Promise<boolean> {
    const emailExists = await this.repository.exists({ where: { email } });
    return emailExists;
  }
}
