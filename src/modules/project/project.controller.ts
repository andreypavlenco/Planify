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
import { ProjectStatus, RoleName } from 'src/common/enums';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles, User } from 'src/common/decorators';
import { DeleteResult } from 'typeorm';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Roles(RoleName.ADMIN, RoleName.MANAGER, RoleName.USER)
  @UseGuards(RoleGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() dto: CreateProjectDto, @User() user): Promise<Project> {
    return this.projectService.create(dto, user.id);
  }

  @Roles(RoleName.ADMIN, RoleName.MANAGER, RoleName.USER)
  @UseGuards(RoleGuard)
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Project> {
    return this.projectService.findById(id);
  }

  @Roles(RoleName.ADMIN, RoleName.MANAGER)
  @UseGuards(RoleGuard)
  @HttpCode(HttpStatus.OK)
  @Put(':progectId')
  async update(
    @Param('projectId') projectId: number,
    @Body() dto: UpdateProjectDto,
  ): Promise<Project> {
    return this.projectService.update(projectId, dto);
  }

  @Roles(RoleName.ADMIN, RoleName.MANAGER)
  @UseGuards(RoleGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':projectId')
  async remove(@Param('projectId') projectId: number): Promise<DeleteResult> {
    return this.projectService.remove(projectId);
  }

  @Roles(RoleName.ADMIN, RoleName.MANAGER)
  @UseGuards(RoleGuard)
  @Get(':projectId/details')
  async getProjectDetails(
    @Param('projectId') projectId: number,
  ): Promise<Project> {
    return this.projectService.findProjectWithUsersAndTasks(projectId);
  }

  @Roles(RoleName.ADMIN, RoleName.MANAGER)
  @UseGuards(RoleGuard)
  @Get()
  async getFilteredProjects(
    @Query('sortDate') sortDate: 'ASC' | 'DESC' = 'ASC',
    @Query('status') status?: ProjectStatus,
  ): Promise<Project[]> {
    return this.projectService.findProjectsByStatusAndDate(sortDate, status);
  }
}
