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
import { TaskProviders } from 'src/common/providers';
import { RoleModule } from '../role/role.module';
import { UserModule } from '../user/user.module';
import { ProjectModule } from '../project/project.module';
import { ActionHistoryModule } from '../action-history/action-history.module';
import { ExtractProjectIdMiddleware } from 'src/common/middlewares';

@Module({
  imports: [
    DataBaseModule,
    RoleModule,
    UserModule,
    ProjectModule,
    ActionHistoryModule,
  ],
  controllers: [TaskController],
  providers: [TaskService, ...TaskProviders, TaskRepository],
})
export class TaskModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ExtractProjectIdMiddleware)
      .forRoutes(
        { path: 'projects/:projectId/tasks', method: RequestMethod.POST },
        { path: 'projects/:projectId/tasks', method: RequestMethod.GET },
        { path: 'projects/:projectId/tasks/:id', method: RequestMethod.DELETE },
        { path: 'projects/:projectId/tasks/:id', method: RequestMethod.PUT },
      );
  }
}
