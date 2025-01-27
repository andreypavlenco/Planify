import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { GetWeatherDTO } from './dto/getWeather.dto';
import { WeatherAPIService } from '../../core/services/weather-api.service';
import { WinstonLoggerService } from 'src/core/utils/logger/winston-logger.service';
import { RedisService } from 'src/core/services/redis.service';

@Injectable()
export class WeatherService {
  constructor(
    private readonly weatherAPIService: WeatherAPIService,
    private readonly redisService: RedisService,
    private readonly logger: WinstonLoggerService,
  ) {}

  async getWeather(data: GetWeatherDTO): Promise<{ result: any }> {
    this.logger.info(
      `Fetching weather data for lat: ${data.lat}, long: ${data.long}`,
    );

    try {
      const cacheKey = `weather_${data.lat}_${data.long}`;
      const cachedData = await this.redisService.get(cacheKey);
      if (cachedData) {
        return { result: cachedData };
      }
      const result = await this.weatherAPIService.getWeather(
        data.lat,
        data.long,
      );

      await this.redisService.set(cacheKey, JSON.stringify(result));
      this.logger.info(`Stored weather data in cache for key: ${cacheKey}`);

      return { result };
    } catch (error) {
      this.logger.error(`Error fetching weather data: ${error.message}`);
      throw new HttpException(
        'Failed to fetch weather data.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
