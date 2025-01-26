import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { Project } from 'src/entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectStatus } from 'src/common/enums';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles, User } from 'src/common/decorators';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Roles('admin', 'manager', 'user')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() dto: CreateProjectDto, @User() user): Promise<Project> {
    return this.projectService.create(dto, user.id);
  }

  @Roles('admin', 'manager')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Project> {
    return this.projectService.findById(id);
  }

  @Roles('admin', 'manager')
  @UseGuards(RoleGuard)
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() dto: UpdateProjectDto,
  ): Promise<Project> {
    return this.projectService.update(id, dto);
  }

  @Roles('admin', 'manager')
  @UseGuards(RoleGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.projectService.remove(id);
  }

  @Roles('admin', 'manager')
  @UseGuards(RoleGuard)
  @Get(':id/details')
  getProjectDetails(@Param('id') id: number): Promise<Project> {
    return this.projectService.findProjectWithUsersAndTasks(id);
  }

  @Roles('admin', 'manager')
  @UseGuards(RoleGuard)
  @Get()
  getFilteredProjects(
    @Query('sortDate') sortDate: 'ASC' | 'DESC' = 'ASC',
    @Query('status') status?: ProjectStatus,
  ): Promise<Project[]> {
    return this.projectService.findProjectsByStatusAndDate(sortDate, status);
  }
}
