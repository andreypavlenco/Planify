import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { Module } from '@nestjs/common';
import { taskProviders } from './providers/task.providers';
import { TaskRepository } from './repository/task.repository';
import { DataBaseModule } from 'src/database/database.module';

@Module({
  imports: [DataBaseModule],
  controllers: [TaskController],
  providers: [
    TaskService,
    ...taskProviders,
    {
      provide: 'TASK_REPOSITORY',
      useClass: TaskRepository,
    },
  ],
})
export class TaskModule {}
