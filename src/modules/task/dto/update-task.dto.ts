import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';
import { TaskStatus } from 'src/common/enums';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiPropertyOptional({
    example: 'Update API Endpoint',
    description: 'The name of the task to update',
    maxLength: 255,
  })
  name?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'The ID of the project associated with the task',
  })
  projectId?: number;

  @ApiPropertyOptional({
    example: 101,
    description: 'The ID of the user who owns the task',
  })
  ownerId?: number;

  @ApiPropertyOptional({
    example: 102,
    description: 'The ID of the user assigned to the task',
  })
  assigneeId?: number;

  @ApiPropertyOptional({
    example: 'To Do',
    description: 'The updated status of the task',
    enum: ['To Do', 'In Progress', 'Done'],
  })
  status?: TaskStatus;

  @ApiPropertyOptional({
    example: '2025-02-15T10:00:00Z',
    description: 'The updated deadline for the task',
    type: String,
    format: 'date-time',
  })
  deadline?: Date;

  @ApiPropertyOptional({
    example: 'Update the endpoint to include new business logic',
    description: 'A detailed description of the updates to be made',
  })
  description?: string;
}
