import { Injectable } from '@nestjs/common';
import { RedisClient } from '../../redis/redis.client';
import { Redis } from 'ioredis';
import { WinstonLoggerService } from 'src/shared/utils/logger/winston-logger.service';

@Injectable()
export class RedisService {
  private readonly logger: WinstonLoggerService;
  private client: Redis;

  constructor(private redisClient: RedisClient) {
    this.client = this.redisClient.getClient();
  }

  async get(key: string): Promise<string | null> {
    try {
      const data = await this.client.get(key);
      if (data) {
        await this.client.expire(key, 3600);
        this.logger.info(`Data retrieved for key "${key}": ${data}`);
      }

      return data;
    } catch (error) {
      this.logger.error(`Error getting Redis key "${key}": ${error.message}`);
      throw error;
    }
  }

  async set(key: string, value: string): Promise<string> {
    try {
      const result = await this.client.set(key, value, 'EX', 3600);
      this.logger.info(`Data set for key "${key}": ${result}`);

      return result;
    } catch (error) {
      this.logger.error(`Error setting Redis key "${key}": ${error.message}`);
      throw error;
    }
  }
}
