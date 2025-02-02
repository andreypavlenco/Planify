import { RoleModule } from './modules/role/role.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { TaskModule } from './modules/task/task.module';
import { ProjectModule } from './modules/project/project.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DataBaseModule } from 'src/database/database.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { ActionHistoryModule } from './modules/action-history/action-history.module';
import { LoggerModule } from 'src/shared/utils/logger/logger.module.';
import { WeatherModule } from './modules/weather-api/weather.module';
import { RedisModule } from 'src/core/redis/redis.module';
import { EmailModule } from './modules/email/email.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    LoggerModule,
    WeatherModule,
    ActionHistoryModule,
    EmailModule,
    RoleModule,
    UserModule,
    TaskModule,
    ProjectModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ScheduleModule.forRoot(),
    RedisModule,
    DataBaseModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
