import { Module } from '@nestjs/common';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { WeatherAPIService } from '../../core/services/weather-api.service';
import { BullModule } from '@nestjs/bullmq';
import { GET_WEATHER_QUEUE } from 'src/common/constants';

@Module({
  imports: [
    BullModule.registerQueue({
      name: GET_WEATHER_QUEUE,
    }),
  ],
  controllers: [WeatherController],
  providers: [WeatherService, WeatherAPIService],
})
export class WeatherModule {}
