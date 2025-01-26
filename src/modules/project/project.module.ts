import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { ProjectRepository } from './repository/project.repository';
import { DataBaseModule } from 'src/database/database.module';
import { ProjectProviders } from 'src/common/providers';
import { UserModule } from '../user/user.module';
import { RoleModule } from '../role/role.module';
import { ExtractProjectIdMiddleware } from 'src/common/middlewares';

@Module({
  imports: [DataBaseModule, UserModule, RoleModule],
  controllers: [ProjectController],
  providers: [ProjectService, ...ProjectProviders, ProjectRepository],
  exports: [ProjectService],
})
export class ProjectModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ExtractProjectIdMiddleware)
      .forRoutes(
        { path: 'projects/:id', method: RequestMethod.PUT },
        { path: 'projects/:id', method: RequestMethod.DELETE },
        { path: 'projects/:id/details', method: RequestMethod.GET },
        { path: 'projects/:id', method: RequestMethod.GET },
        { path: 'projects/:projectId/tasks', method: RequestMethod.POST },
      );
  }
}
