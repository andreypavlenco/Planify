import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ProjectProviders, UserProviders } from 'src/database/providers';
import { UserRepository } from '../user/repository/user.repository';
import { ProjectRepository } from '../project/repository/project.repository';
import { DataBaseModule } from 'src/database/database.module';
import { RoleModule } from '../role/role.module';
import { ExtractProjectIdMiddleware } from 'src/common/middlewares';
import { ANALYTICS_CONTROLLER, ANALYTICS_ROUTES } from './constants';

@Module({
  imports: [DataBaseModule, RoleModule],
  controllers: [AnalyticsController],
  providers: [
    AnalyticsService,
    ...UserProviders,
    UserRepository,
    ...ProjectProviders,
    ProjectRepository,
  ],
})
export class AnalyticsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ExtractProjectIdMiddleware).forRoutes(
      {
        path: `${ANALYTICS_CONTROLLER}/${ANALYTICS_ROUTES.TASK_STATUS_COUNT}`,
        method: RequestMethod.GET,
      },
      {
        path: `${ANALYTICS_CONTROLLER}/${ANALYTICS_ROUTES.AVERAGE_COMPLETION_TIME}`,
        method: RequestMethod.GET,
      },
      {
        path: `${ANALYTICS_CONTROLLER}/${ANALYTICS_ROUTES.TOP_ACTIVE_USERS}`,
        method: RequestMethod.GET,
      },
    );
  }
}
