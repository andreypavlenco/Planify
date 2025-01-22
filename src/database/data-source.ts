import { DataSource } from 'typeorm';
import { DataSourceOptions } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT, 10) || 3306,
  username: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'root',
  database: process.env.MYSQL_DB || 'planify',
  entities: [__dirname + '/../entities/*.entity.{js,ts}'],
  migrations: [__dirname + '/../migrations/**/*.{js,ts}'],
  synchronize: false,
  logging: true,
  cache: {
    duration: 60000,
  },
} as DataSourceOptions);
