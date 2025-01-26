import { Inject, Injectable } from '@nestjs/common';
import { PROVIDER_TOKENS } from 'src/common/constants';
import { BaseCrudRepository } from 'src/common/repositories/base-crud.repository';
import { ActionHistory } from 'src/database/entities/action-history.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ActionHistoryRepository extends BaseCrudRepository<ActionHistory> {
  constructor(
    @Inject(PROVIDER_TOKENS.ACTION_HISTORY)
    protected readonly repository: Repository<ActionHistory>,
  ) {
    super(repository);
  }

  async findByProject(projectId: number): Promise<ActionHistory[]> {
    return this.repository.find({
      where: { project: { id: projectId } },
      relations: ['task', 'user', 'project'],
      order: { changeDate: 'DESC' },
    });
  }
}
