import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class ReqUserDto {
  @Type(() => Number)
  @IsNumber()
  id: number;
}
