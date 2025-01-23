import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsDate,
  IsInt,
} from 'class-validator';
import { TaskStatus } from 'src/enums';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsInt()
  assignee: number;

  @IsNotEmpty()
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @IsOptional()
  @IsDate()
  deadline: Date;
}
