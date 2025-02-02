import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TaskRepository } from './repository/task.repository';
import { DataBaseModule } from 'src/database/database.module';
import { TaskProviders } from 'src/database/providers';
import { RoleModule } from '../role/role.module';
import { UserModule } from '../user/user.module';
import { ProjectModule } from '../project/project.module';
import { ActionHistoryModule } from '../action-history/action-history.module';
import { ExtractProjectIdMiddleware } from 'src/common/middlewares';
import { JwtModule } from '@nestjs/jwt';
import { TaskGateway } from 'src/websocket/task.gateway';
import { EmailModule } from 'src/modules/email/email.module';
import { TASK_CONTROLLER, TASK_ROUTES } from './constants';

@Module({
  imports: [
    DataBaseModule,
    RoleModule,
    EmailModule,
    UserModule,
    ProjectModule,
    ActionHistoryModule,
    JwtModule,
  ],
  controllers: [TaskController],
  providers: [
    TaskService,
    ...TaskProviders,
    TaskRepository,
    TaskGateway,
    EmailModule,
  ],
})
export class TaskModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ExtractProjectIdMiddleware).forRoutes(
      {
        path: `${TASK_CONTROLLER}/${TASK_ROUTES.CREATE}`,
        method: RequestMethod.POST,
      },
      {
        path: `${TASK_CONTROLLER}/${TASK_ROUTES.GET_BY_ID}`,
        method: RequestMethod.GET,
      },
      {
        path: `${TASK_CONTROLLER}/${TASK_ROUTES.DELETE}`,
        method: RequestMethod.DELETE,
      },
      {
        path: `${TASK_CONTROLLER}/${TASK_ROUTES.UPDATE}`,
        method: RequestMethod.PUT,
      },
    );
  }
}
