import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisClient } from './redis.client';
import { BullModule } from '@nestjs/bullmq';
import { RedisService } from './redis.service';

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
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
