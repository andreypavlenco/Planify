import {
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsString,
  IsDate,
  IsInt,
  MaxLength,
} from 'class-validator';
import { TaskStatus } from 'src/common/enums';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsNotEmpty()
  @IsInt()
  projectId: number;

  @IsNotEmpty()
  @IsInt()
  ownerId: number;

  @IsOptional()
  @IsInt()
  assigneeId?: number;

  @IsNotEmpty()
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @IsOptional()
  @IsDate()
  deadline?: Date;

  @IsOptional()
  @IsString()
  description?: string;
}
