import { Injectable } from '@nestjs/common';
import {
  HealthIndicatorResult,
  HealthIndicatorService,
} from '@nestjs/terminus';
//import Redis from 'ioredis';
import { RedisClient } from 'src/core/redis/redis.client';
import { WinstonLoggerService } from 'src/shared/utils/logger';

@Injectable()
export class RedisHealthIndicator {
  constructor(
    private readonly redisClient: RedisClient,
    private readonly healthIndicatorService: HealthIndicatorService,
    private readonly logger: WinstonLoggerService,
  ) {}

  async pingCheck(key: string): Promise<HealthIndicatorResult> {
    try {
      const indicator = this.healthIndicatorService.check(key);
      const isHealthy = await this.redisClient.getClient().ping();
      return isHealthy === 'PONG' ? indicator.up() : indicator.down(isHealthy);
    } catch (error) {
      this.logger.error(`Error pinging Redis: ${error.message}`);
    }
  }
}
