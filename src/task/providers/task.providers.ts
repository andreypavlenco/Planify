import { Task } from 'src/entities/task.entity';
import { DataSource } from 'typeorm';

export const taskProviders = [
  {
    provide: 'TASK_PROVIDERS',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Task),
    inject: ['DATA_SOURCE'],
  },
];
