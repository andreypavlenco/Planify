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
import { EmailModule } from 'src/modules/email/email.module';
import { BullModule } from '@nestjs/bullmq';
import { DELETE_PROJECTS_COMPLETED_QUEUE } from 'src/common/constants';
import { PROJECT_CONTROLLER, PROJECT_ROUTES } from './constants';

@Module({
  imports: [
    DataBaseModule,
    UserModule,
    RoleModule,
    EmailModule,
    BullModule.registerQueue({
      name: DELETE_PROJECTS_COMPLETED_QUEUE,
    }),
  ],
  controllers: [ProjectController],
  providers: [ProjectService, ...ProjectProviders, ProjectRepository],
  exports: [ProjectService],
})
export class ProjectModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ExtractProjectIdMiddleware).forRoutes(
      {
        path: `${PROJECT_CONTROLLER}/${PROJECT_ROUTES.UPDATE}`,
        method: RequestMethod.PUT,
      },
      {
        path: `${PROJECT_CONTROLLER}/${PROJECT_ROUTES.DELETE}`,
        method: RequestMethod.DELETE,
      },
      {
        path: `${PROJECT_CONTROLLER}/${PROJECT_ROUTES.DETAILS}`,
        method: RequestMethod.GET,
      },
      {
        path: `${PROJECT_CONTROLLER}/${PROJECT_ROUTES.GET_BY_ID}`,
        method: RequestMethod.GET,
      },
    );
  }
}
