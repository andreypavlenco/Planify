import { DataSource, EntityTarget, Repository } from 'typeorm';

export function createProvider<T>(
  token: string,
  entity: EntityTarget<T>,
): {
  provide: string;
  useFactory: (dataSource: DataSource) => Repository<T>;
  inject: string[];
} {
  return {
    provide: token,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(entity),
    inject: ['DATA_SOURCE'],
  };
}
