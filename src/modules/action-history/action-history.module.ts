import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ActionHistoryService } from './action-history.service';
import { ActionHistoryProviders } from 'src/common/providers/action-history.providers';
import { DataBaseModule } from 'src/database/database.module';
import { ActionHistoryRepository } from './repository/action-history.repository';
import { ExtractProjectIdMiddleware } from 'src/common/middlewares';

@Module({
  imports: [DataBaseModule],
  providers: [
    ...ActionHistoryProviders,
    ActionHistoryRepository,
    ActionHistoryService,
  ],
  exports: [ActionHistoryService],
})
export class ActionHistoryModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ExtractProjectIdMiddleware).forRoutes({
      path: 'projects/:projectId/history',
      method: RequestMethod.GET,
    });
  }
}
