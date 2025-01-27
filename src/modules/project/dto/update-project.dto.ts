import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ProjectStatus } from 'src/shared/enums';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  @ApiPropertyOptional({
    example: 'Updated Project Name',
    description: 'The updated name of the project',
  })
  name?: string;

  @ApiPropertyOptional({
    example: 'Updated project description',
    description: 'The updated description of the project',
  })
  description?: string;

  @ApiPropertyOptional({
    example: 'IN_PROGRESS',
    description: 'The updated status of the project',
    enum: ProjectStatus,
  })
  status?: ProjectStatus;
}
