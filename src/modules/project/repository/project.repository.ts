import { Inject, Injectable } from '@nestjs/common';
import { BaseCrudRepository } from 'src/common/repositories/base-crud.repository';
import { Project } from 'src/entities/project.entity';
import { ProjectStatus } from 'src/common/enums';
import { FindManyOptions, Repository } from 'typeorm';
import { PROVIDER_TOKENS } from 'src/common/providers/provider.tokens';

@Injectable()
export class ProjectRepository extends BaseCrudRepository<Project> {
  constructor(
    @Inject(PROVIDER_TOKENS.PROJECT)
    protected readonly repository: Repository<Project>,
  ) {
    super(repository);
  }

  async findByIdWithRelations(
    id: number,
    relations: string[] = ['users', 'tasks'],
  ): Promise<Project> {
    return this.findById(id, relations);
  }

  async findProjectsByStatusAndDate(
    sortDate: 'ASC' | 'DESC',
    status?: ProjectStatus,
  ): Promise<Project[]> {
    try {
      const options: FindManyOptions<Project> = {
        order: {
          createdAt: sortDate,
        },
      };
      if (status) {
        options.where = { status };
      }
      return await this.repository.find(options);
    } catch (error) {
      throw new Error(
        `Error fetching projects with filters (status: ${status}, sort: ${sortDate}): ${error.message}`,
      );
    }
  }
}
