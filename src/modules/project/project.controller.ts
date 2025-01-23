import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { Project } from 'src/entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectStatus } from 'src/common/enums';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  create(@Body() dto: CreateProjectDto): Promise<Project> {
    return this.projectService.create(dto);
  }

  //   @Get()
  //   findAll(): Promise<Project[]> {
  //     return this.projectService.findAll();
  //   }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Project> {
    return this.projectService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() dto: UpdateProjectDto,
  ): Promise<Project> {
    return this.projectService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.projectService.remove(id);
  }

  @Get('/:id/details')
  async findOneWithUsersAndTasks(@Param('id') id: number) {
    return this.projectService.findAllWithUsersAndTasks(id);
  }

  @Get()
  async getProjects(
    @Query('sortDate') sortDate: string = 'ASC',
    @Query('status') status?: ProjectStatus,
  ): Promise<Project[]> {
    const validSortDate: 'ASC' | 'DESC' = sortDate === 'DESC' ? 'DESC' : 'ASC';
    return this.projectService.findProjectsWithFilters(validSortDate, status);
  }
}
