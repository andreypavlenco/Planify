import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { ProjectStatus } from 'src/shared/enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({
    example: 'New Project',
    description: 'Name of the project. Must be between 1 and 255 characters.',
  })
  @IsString()
  @Length(1, 255)
  name: string;

  @ApiPropertyOptional({
    example: 'Description of the project.',
    description: 'Optional project description.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: ProjectStatus.ACTIVE,
    description: 'Optional status of the project.',
    enum: ProjectStatus,
  })
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;
}
