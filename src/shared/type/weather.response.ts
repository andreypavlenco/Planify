export interface WeatherResponse {
  weather: Array<{ description: string }>;
  main: { temp: number; pressure: number; humidity: number };
  wind: { speed: number };
  name: string;
}
