import { IsNotEmpty, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetWeatherDTO {
  @ApiProperty({
    description: 'Latitude of the location.',
    example: 37.7749,
    minimum: -90,
    maximum: 90,
  })
  @IsNotEmpty({ message: 'Latitude (lat) is required.' })
  @IsNumber({}, { message: 'Latitude (lat) must be a number.' })
  @Min(-90, { message: 'Latitude (lat) must be between -90 and 90.' })
  @Max(90, { message: 'Latitude (lat) must be between -90 and 90.' })
  lat: number;

  @ApiProperty({
    description: 'Longitude of the location.',
    example: -122.4194,
    minimum: -180,
    maximum: 180,
  })
  @IsNotEmpty({ message: 'Longitude (long) is required.' })
  @IsNumber({}, { message: 'Longitude (long) must be a number.' })
  @Min(-180, { message: 'Longitude (long) must be between -180 and 180.' })
  @Max(180, { message: 'Longitude (long) must be between -180 and 180.' })
  long: number;
}
