import { Inject, Injectable } from '@nestjs/common';
import { BaseCrudRepository } from 'src/common/repositories/base-crud.repository';
import { Task } from 'src/entities/task.entity';
import { TaskStatus } from 'src/enums';
import { Repository } from 'typeorm';

@Injectable()
export class TaskRepository extends BaseCrudRepository<Task> {
  constructor(
    @Inject('TASK_PROVIDERS')
    protected readonly repository: Repository<Task>,
  ) {
    super(repository);
  }

  findOneWithUsersAndTasks(
    id: number,
    relations: string[] = [],
  ): Promise<Task> {
    return this.findOne(id, relations);
  }

  findWithFilters(
    sortDate: 'ASC' | 'DESC',
    status?: TaskStatus,
  ): Promise<Task[]> {
    const query = this.repository.createQueryBuilder('task');
    if (status) {
      query.where('task.status = :status', { status });
    }
    query.orderBy('task.createdAt', sortDate);
    return query.getMany();
  }
}
