import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisClient } from './redis.client';
import { RedisService } from '../core/services/redis.service';

@Global()
@Module({
  providers: [RedisService, RedisClient, ConfigService],
  exports: [RedisService],
})
export class RedisModule {}
