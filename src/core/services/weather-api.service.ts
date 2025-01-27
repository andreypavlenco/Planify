import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

interface WeatherResponse {
  weather: Array<{ description: string }>;
  main: { temp: number; pressure: number; humidity: number };
  wind: { speed: number };
  name: string;
}

@Injectable()
export class WeatherAPIService {
  private readonly weatherAPIKey: string;
  private readonly weatherAPIBaseUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.weatherAPIKey = this.configService.get<string>(
      'OPEN_WEATHER_MAP_API_KEY',
    );
    if (!this.weatherAPIKey) {
      throw new Error(
        'OpenWeatherMap API key is not defined in environment variables',
      );
    }
    this.weatherAPIBaseUrl = 'https://api.openweathermap.org/data/2.5';
  }

  async getWeather(lat: number, lon: number): Promise<WeatherResponse> {
    const url = `${this.weatherAPIBaseUrl}/weather`;
    try {
      const response = await axios.get<WeatherResponse>(url, {
        params: {
          lat,
          lon,
          appid: this.weatherAPIKey,
          units: 'metric',
        },
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'fetching weather data');
    }
  }
  private handleError(error: any, context: string): never {
    if (error.response) {
      const { status, statusText, data } = error.response;
      throw new HttpException(
        `Error ${context}: ${status} ${statusText} - ${data.message || 'Unknown error'}`,
        status,
      );
    } else if (error.request) {
      throw new HttpException(
        `Network error ${context}: ${error.message}`,
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    } else {
      throw new HttpException(
        `Unexpected error ${context}: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
