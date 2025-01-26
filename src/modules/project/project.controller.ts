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
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateProjectDto,
  ): Promise<Project> {
    return this.projectService.update(id, dto);
  }

  @Roles(RoleName.ADMIN, RoleName.MANAGER)
  @UseGuards(RoleGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.projectService.remove(id);
  }

  @Roles(RoleName.ADMIN, RoleName.MANAGER)
  @UseGuards(RoleGuard)
  @Get(':id/details')
  async getProjectDetails(@Param('id') id: number): Promise<Project> {
    return this.projectService.findProjectWithUsersAndTasks(id);
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
