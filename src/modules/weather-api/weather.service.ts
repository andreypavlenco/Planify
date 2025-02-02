import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { GetWeatherDTO } from './dto/getWeather.dto';
import { GET_WEATHER_QUEUE } from 'src/common/constants';
import { WinstonLoggerService } from 'src/shared/utils/logger';
import { WeatherResponse } from '../../shared/type';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RedisService } from 'src/core/redis';

@Injectable()
export class WeatherService {
  constructor(
    private readonly redisService: RedisService,
    private readonly logger: WinstonLoggerService,
    @InjectQueue(GET_WEATHER_QUEUE) private readonly weatherQueue: Queue,
  ) {}

  async getWeather(data: GetWeatherDTO): Promise<WeatherResponse> {
    this.logger.info(
      `Fetching weather data for lat: ${data.lat}, long: ${data.long}`,
    );
    try {
      const cacheKey = `weather_${data.lat}_${data.long}`;
      const cachedData = await this.redisService.get(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
      await this.weatherQueue.add(
        'fetch-weather',
        { lat: data.lat, long: data.long },
        { priority: 2 },
      );
      this.logger.info(
        `Added weather fetch task to queue for lat: ${data.lat}, long: ${data.long}`,
      );
    } catch (error) {
      this.logger.error(`Error fetching weather data: ${error.message}`);
      throw new HttpException(
        'Failed to fetch weather data.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Cron(CronExpression.EVERY_HOUR)
  async queueWeatherFetch(): Promise<void> {
    this.logger.info('Running scheduled weather data fetch');

    try {
      const lastRequestKey = 'last_weather_request';
      const lastRequest = await this.redisService.get(lastRequestKey);
      let data: GetWeatherDTO;

      if (lastRequest) {
        data = JSON.parse(lastRequest);
        this.logger.info(
          `Using last saved weather request: ${JSON.stringify(data)}`,
        );
      } else {
        data = { lat: 40.7128, long: -74.006 };
        this.logger.warn(
          'No last weather request found, using default location',
        );
      }
      const cacheKey = `weather_${data.lat}_${data.long}`;
      const cachedData = await this.redisService.get(cacheKey);
      if (cachedData) {
        this.logger.info(`Using cached weather data for ${cacheKey}`);

        return;
      }
      await this.weatherQueue.add(
        'fetch-weather',
        { lat: data.lat, long: data.long },
        { priority: 2 },
      );
      this.logger.info(
        `Added weather fetch task to queue for lat: ${data.lat}, long: ${data.long}`,
      );
    } catch (error) {
      this.logger.error(`Error fetching weather data: ${error.message}`);
      throw new HttpException(
        'Failed to fetch weather data.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
