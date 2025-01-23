import { UserModule } from './../user/user.module';
import { TaskModule } from '../task/task.module';
import { ProjectModule } from '../project/project.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DataBaseModule } from 'src/database/database.module';

@Module({
  imports: [
    UserModule,
    TaskModule,
    ProjectModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DataBaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
