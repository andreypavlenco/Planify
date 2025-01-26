import { Injectable } from '@nestjs/common';
import { DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TypeOrmConfigService {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): DataSourceOptions {
    return {
      type: 'mysql',
      host: this.configService.get<string>('MYSQL_HOST', 'localhost'),
      port: parseInt(this.configService.get<string>('MYSQL_PORT', '3306'), 10),
      username: this.configService.get<string>('MYSQL_USER', 'root'),
      password: this.configService.get<string>('MYSQL_PASSWORD', 'root'),
      database: this.configService.get<string>('MYSQL_DB', 'planify'),
      synchronize: false,
      entities: [__dirname + '/../entities/*.entity.{js,ts}'],
      migrations: [__dirname + '/../migrations/**/*.{js,ts}'],
      cache: {
        duration: 60000,
      },
    };
  }
}
