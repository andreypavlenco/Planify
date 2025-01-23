import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { ProjectRepository } from './repository/project.repository';
import { DataBaseModule } from 'src/database/database.module';
import { projectProviders } from './providers/project.providers';

@Module({
  imports: [DataBaseModule],
  controllers: [ProjectController],
  providers: [
    ProjectService,
    ...projectProviders,
    {
      provide: 'PROJECT_REPOSITORY',
      useClass: ProjectRepository,
    },
  ],
})
export class ProjectModule {}
