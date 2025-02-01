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
import { ProjectProviders } from 'src/database/providers';
import { UserModule } from '../user/user.module';
import { RoleModule } from '../role/role.module';
import { ExtractProjectIdMiddleware } from 'src/common/middlewares';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [DataBaseModule, UserModule, RoleModule, EmailModule],
  controllers: [ProjectController],
  providers: [ProjectService, ...ProjectProviders, ProjectRepository],
  exports: [ProjectService],
})
export class ProjectModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ExtractProjectIdMiddleware)
      .forRoutes(
        { path: 'projects/:projectId', method: RequestMethod.PUT },
        { path: 'projects/:projectId', method: RequestMethod.DELETE },
        { path: 'projects/:projectId/details', method: RequestMethod.GET },
        { path: 'projects/:id', method: RequestMethod.GET },
      );
  }
}
