import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { WinstonLoggerService } from 'src/shared/utils/logger';
import { DELETE_PROJECTS_COMPLETED_QUEUE } from 'src/common/constants';
import { ProjectRepository } from './repository/project.repository';
import { DeleteResult } from 'typeorm';

@Processor(DELETE_PROJECTS_COMPLETED_QUEUE)
@Injectable()
export class ProjectProcessor extends WorkerHost {
  constructor(
    private readonly repository: ProjectRepository,
    private readonly logger: WinstonLoggerService,
  ) {
    super();
  }
  async process(): Promise<DeleteResult> {
    this.logger.info('Starting scheduled removal of completed projects');

    try {
      return await this.repository.removeProjectCompleted();
    } catch (error) {
      this.logger.error('Failed to remove completed projects', {
        error: error.message,
      });
      throw error;
    }
  }
}
