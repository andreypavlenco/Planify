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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { ProjectService } from './project.service';
import { Project } from 'src/entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectStatus, RoleName } from 'src/common/enums';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles, User } from 'src/common/decorators';
import { DeleteResult } from 'typeorm';

@ApiTags('Projects')
@ApiBearerAuth()
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Project successfully created',
    type: Project,
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Access denied' })
  @ApiBody({ type: CreateProjectDto })
  @Roles(RoleName.ADMIN, RoleName.MANAGER, RoleName.USER)
  @UseGuards(RoleGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() dto: CreateProjectDto, @User() user): Promise<Project> {
    return this.projectService.create(dto, user.id);
  }

  @ApiOperation({ summary: 'Get project by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Project retrieved successfully',
    type: Project,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Project not found',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Project ID' })
  @Roles(RoleName.ADMIN, RoleName.MANAGER, RoleName.USER)
  @UseGuards(RoleGuard)
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Project> {
    return this.projectService.findById(id);
  }

  @ApiOperation({ summary: 'Update project by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Project updated successfully',
    type: Project,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Project not found',
  })
  @ApiParam({ name: 'projectId', type: Number, description: 'Project ID' })
  @ApiBody({ type: UpdateProjectDto })
  @Roles(RoleName.ADMIN, RoleName.MANAGER)
  @UseGuards(RoleGuard)
  @HttpCode(HttpStatus.OK)
  @Put(':projectId')
  async update(
    @Param('projectId') projectId: number,
    @Body() dto: UpdateProjectDto,
  ): Promise<Project> {
    return this.projectService.update(projectId, dto);
  }

  @ApiOperation({ summary: 'Delete project by ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Project deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Project not found',
  })
  @ApiParam({ name: 'projectId', type: Number, description: 'Project ID' })
  @Roles(RoleName.ADMIN, RoleName.MANAGER)
  @UseGuards(RoleGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':projectId')
  async remove(@Param('projectId') projectId: number): Promise<DeleteResult> {
    return this.projectService.remove(projectId);
  }

  @ApiOperation({ summary: 'Get project details with users and tasks' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Project details retrieved successfully',
    type: Project,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Project not found',
  })
  @ApiParam({ name: 'projectId', type: Number, description: 'Project ID' })
  @Roles(RoleName.ADMIN, RoleName.MANAGER)
  @UseGuards(RoleGuard)
  @Get(':projectId/details')
  async getProjectDetails(
    @Param('projectId') projectId: number,
  ): Promise<Project> {
    return this.projectService.findProjectWithUsersAndTasks(projectId);
  }

  @ApiOperation({ summary: 'Get filtered projects' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Projects retrieved successfully',
    type: [Project],
  })
  @ApiQuery({
    name: 'sortDate',
    type: String,
    enum: ['ASC', 'DESC'],
    required: false,
    description: 'Sort order for projects',
  })
  @ApiQuery({
    name: 'status',
    type: String,
    required: false,
    description: 'Filter by project status',
  })
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
