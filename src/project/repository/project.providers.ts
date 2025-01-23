import { Project } from 'src/entities/project.entity';
import { DataSource } from 'typeorm';

export const projectProviders = [
  {
    provide: 'PROJECT_PROVIDERS',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Project),
    inject: ['DATA_SOURCE'],
  },
];
