import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { ProjectStatus } from 'src/enums';

export class CreateProjectDto {
  @IsString()
  @Length(1, 255)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;
}
