import { Module } from '@nestjs/common';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { WeatherAPIService } from '../../core/services/weather-api.service';

@Module({
  controllers: [WeatherController],
  providers: [WeatherService, WeatherAPIService],
})
export class WeatherModule {}
