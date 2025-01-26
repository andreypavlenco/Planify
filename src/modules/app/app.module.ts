import { ActionHistoryController } from '../action-history/action-history.controller';
import { RoleModule } from './../role/role.module';
import { AuthModule } from './../auth/auth.module';
import { UserModule } from './../user/user.module';
import { TaskModule } from '../task/task.module';
import { ProjectModule } from '../project/project.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DataBaseModule } from 'src/database/database.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ActionHistoryModule } from '../action-history/action-history.module';
import { LoggerModule } from 'src/logger/logger.module.';

@Module({
  imports: [
    LoggerModule,
    ActionHistoryModule,
    RoleModule,
    UserModule,
    TaskModule,
    ProjectModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DataBaseModule,
    AuthModule,
  ],
  controllers: [ActionHistoryController, AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
