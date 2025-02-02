import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { WeatherAPIService } from '../../core/services/weather-api.service';
import { GET_WEATHER_QUEUE } from 'src/common/constants';
import { WinstonLoggerService } from 'src/shared/utils/logger';
import { WeatherResponse } from '../../shared/type';
import { RedisService } from 'src/core/redis';

@Processor(GET_WEATHER_QUEUE)
@Injectable()
export class WeatherProcessor extends WorkerHost {
  constructor(
    private readonly weatherAPIService: WeatherAPIService,
    private readonly redisService: RedisService,
    private readonly logger: WinstonLoggerService,
  ) {
    super();
  }

  async process(job: Job): Promise<WeatherResponse> {
    const { lat, long } = job.data;
    this.logger.info(`Processing weather data for lat: ${lat}, long: ${long}`);

    try {
      const weather = await this.weatherAPIService.getWeather(lat, long);
      const cacheKey = `weather_${lat}_${long}`;
      await this.redisService.set(cacheKey, JSON.stringify(weather));
      this.logger.info(`Stored weather data in cache for key: ${cacheKey}`);

      return weather;
    } catch (error) {
      this.logger.error(
        `Failed to process weather data for lat: ${lat}, long: ${long}`,
        error,
      );
      throw error;
    }
  }
}
