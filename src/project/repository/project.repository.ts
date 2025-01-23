import { Inject, Injectable } from '@nestjs/common';
import { BaseCrudRepository } from 'src/common/repositories/base-crud.repository';
import { Project } from 'src/entities/project.entity';
import { ProjectStatus } from 'src/enums';
import { Repository } from 'typeorm';

@Injectable()
export class ProjectRepository extends BaseCrudRepository<Project> {
  constructor(
    @Inject('PROJECT_PROVIDERS')
    protected readonly repository: Repository<Project>,
  ) {
    super(repository);
  }

  findOneWithUsersAndTasks(
    id: number,
    relations: string[] = [],
  ): Promise<Project> {
    return this.findOne(id, relations);
  }

  findWithFilters(
    sortDate: 'ASC' | 'DESC',
    status?: ProjectStatus,
  ): Promise<Project[]> {
    const query = this.repository.createQueryBuilder('project');
    if (status) {
      query.where('project.status = :status', { status });
    }
    query.orderBy('project.createdAt', sortDate);
    return query.getMany();
  }
}
