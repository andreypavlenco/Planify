import { Controller, Get, HttpCode, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { GetWeatherDTO } from './dto/getWeather.dto';
import { Public } from 'src/common/decorators';
import { ApiTags, ApiQuery, ApiResponse } from '@nestjs/swagger';

@ApiTags('Weather')
@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Public()
  @Get()
  @HttpCode(200)
  @ApiQuery({
    name: 'lat',
    type: Number,
    description: 'Latitude of the location',
  })
  @ApiQuery({
    name: 'long',
    type: Number,
    description: 'Longitude of the location',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved weather data.',
    schema: {
      example: {
        temperature: 25,
        description: 'Sunny',
        humidity: 40,
        windSpeed: 5,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error for query parameters.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  async getWeather(@Query() data: GetWeatherDTO) {
    return this.weatherService.getWeather(data);
  }
}
