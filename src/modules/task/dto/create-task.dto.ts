import {
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsString,
  IsDate,
  IsInt,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus } from 'src/shared/enums';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Develop API Endpoint',
    description: 'The name of the task',
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    example: 1,
    description: 'The ID of the project associated with the task',
  })
  @IsNotEmpty()
  @IsInt()
  projectId: number;

  @ApiProperty({
    example: 101,
    description: 'The ID of the user who owns the task',
  })
  @IsNotEmpty()
  @IsInt()
  ownerId: number;

  @ApiPropertyOptional({
    example: 102,
    description: 'The ID of the user assigned to the task',
  })
  @IsOptional()
  @IsInt()
  assigneeId?: number;

  @ApiProperty({
    example: 'To Do',
    description: 'The current status of the task',
    enum: TaskStatus,
  })
  @IsNotEmpty()
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @ApiPropertyOptional({
    example: '2025-02-15T10:00:00Z',
    description: 'The deadline for the task',
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  @IsDate()
  deadline?: Date;

  @ApiPropertyOptional({
    example: 'Complete the endpoint with full unit tests',
    description: 'A detailed description of the task',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
