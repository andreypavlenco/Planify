import { TypeOrmConfigService } from 'src/config/typeorm.config';
import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    inject: [TypeOrmConfigService],
    useFactory: async (typeOrmConfigService: TypeOrmConfigService) => {
      const dataSource = new DataSource(
        typeOrmConfigService.createTypeOrmOptions(),
      );

      try {
        return await dataSource.initialize();
      } catch (error) {
        console.error('Error during DataSource initialization', error);
        throw error;
      }
    },
  },
];
