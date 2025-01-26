import { Inject, Injectable } from '@nestjs/common';
import { BaseCrudRepository } from 'src/common/repositories/base-crud.repository';
import { Task } from 'src/entities/task.entity';
import { TaskStatus } from 'src/common/enums';
import { FindManyOptions, Repository } from 'typeorm';
import { PROVIDER_TOKENS } from 'src/common/constants/provider.tokens';

@Injectable()
export class TaskRepository extends BaseCrudRepository<Task> {
  constructor(
    @Inject(PROVIDER_TOKENS.TASK)
    protected readonly repository: Repository<Task>,
  ) {
    super(repository);
  }

  findOneWithUsersAndTasks(
    id: number,
    relations: string[] = [],
  ): Promise<Task> {
    return this.findById(id, relations);
  }

  findWithFilters(
    sortDate: 'ASC' | 'DESC' = 'ASC',
    status?: TaskStatus,
  ): Promise<Task[]> {
    if (!['ASC', 'DESC'].includes(sortDate)) {
      throw new Error('Invalid sort order. Use "ASC" or "DESC".');
    }
    const options: FindManyOptions<Task> = {
      where: status ? { status } : {},
      order: { createdAt: sortDate },
    };
    return this.repository.find(options);
  }
}
