import { Module } from '@nestjs/common';
import { databaseProviders } from './ database.providers';
import { TypeOrmConfigService } from 'src/config/typeorm.config.ts';

@Module({
  providers: [TypeOrmConfigService, ...databaseProviders],
  exports: [...databaseProviders],
})
export class DataBaseModule {}
