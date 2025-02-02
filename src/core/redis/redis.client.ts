import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { WinstonLoggerService } from 'src/shared/utils/logger';

@Injectable()
export class RedisClient implements OnApplicationShutdown {
  private static instance: Redis;
  private readonly logger: WinstonLoggerService;
  private client: Redis;

  constructor(
    private readonly configService: ConfigService,
    logger: WinstonLoggerService,
  ) {
    this.logger = logger;

    if (!RedisClient.instance) {
      const host = this.configService.get<string>('REDIS_HOST');
      const port = this.configService.get<number>('REDIS_PORT');
      const db = this.configService.get<number>('REDIS_DB');

      RedisClient.instance = new Redis({
        host,
        port,
        db,
        maxRetriesPerRequest: null,
      });

      RedisClient.instance.on('error', (error) => {
        this.logger.error('Redis Client Error', { error });
      });
      RedisClient.instance.on('connect', () => {
        this.logger.info('Redis connected successfully');
      });
    }
    this.client = RedisClient.instance;
  }

  getClient(): Redis {
    return this.client;
  }

  async onApplicationShutdown() {
    if (this.client) {
      await this.client.quit();
      this.logger.info('Redis connection closed');
    }
  }
}
