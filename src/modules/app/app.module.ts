import { ActionHistoryController } from '../action-history/action-history.controller';
import { RoleModule } from './../role/role.module';
import { AuthModule } from './../auth/auth.module';
import { UserModule } from './../user/user.module';
import { TaskModule } from '../task/task.module';
import { ProjectModule } from '../project/project.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataBaseModule } from 'src/database/database.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ActionHistoryModule } from '../action-history/action-history.module';
import { LoggerModule } from 'src/core/utils/logger/logger.module.';
import { WeatherModule } from '../weather-api/weather.module';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [
    LoggerModule,
    WeatherModule,
    ActionHistoryModule,
    RoleModule,
    UserModule,
    TaskModule,
    ProjectModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    RedisModule,

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
  //exports: [CacheModule],
})
export class AppModule {}
