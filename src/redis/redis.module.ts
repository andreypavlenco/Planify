import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisClient } from './redis.client';
import { RedisService } from '../core/services/redis.service';
import { BullModule } from '@nestjs/bullmq';


@Global()
@Module({
  imports: [
    BullmqModule.forRootAsync({
      imports: [],
      inject: [RedisClient],
      useFactory: (redisClient: RedisClient) => ({
        connection: redisClient.getClient(),
      }),
    }),
  ],
  providers: [RedisService, RedisClient, ConfigService],
  exports: [RedisService, RedisClient],
})
export class RedisModule {}
