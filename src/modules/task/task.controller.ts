import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  HttpStatus,
  HttpCode,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TaskService } from './task.service';
import { Task } from 'src/entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { RoleName, TaskStatus } from 'src/shared/enums';
import { Roles, User } from 'src/common/decorators';
import { RoleGuard } from '../auth/guards/role.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DeleteResult } from 'typeorm';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('projects/:projectId/tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Task successfully created',
    type: Task,
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Access denied' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data provided',
  })
  @ApiParam({
    name: 'projectId',
    type: Number,
    description: 'ID of the project',
  })
  @ApiBody({ type: CreateTaskDto, description: 'Task data' })
  @Roles(RoleName.ADMIN, RoleName.MANAGER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  @Post()
  create(
    @Param('projectId', ParseIntPipe) projectId: number,
    @User() user,
    @Body() dto: CreateTaskDto,
  ): Promise<Task> {
    return this.taskService.create(projectId, user.id, dto);
  }

  @ApiOperation({ summary: 'Get task by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Task successfully retrieved',
    type: Task,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Task not found' })
  @ApiParam({ name: 'id', type: Number, description: 'ID of the task' })
  @Roles(RoleName.ADMIN, RoleName.MANAGER, RoleName.USER)
  @UseGuards(RoleGuard)
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Task> {
    return this.taskService.findById(id);
  }

  @ApiOperation({ summary: 'Update task by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Task successfully updated',
    type: Task,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Task not found' })
  @ApiParam({ name: 'id', type: Number, description: 'ID of the task' })
  @ApiBody({ type: UpdateTaskDto, description: 'Updated task data' })
  @Roles(RoleName.ADMIN, RoleName.MANAGER, RoleName.USER)
  @UseGuards(RoleGuard)
  @Put(':id')
  update(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('id') id: number,
    @Body() dto: UpdateTaskDto,
    @User() user,
  ): Promise<Task> {
    return this.taskService.update(id, dto, user.id, projectId);
  }

  @ApiOperation({ summary: 'Delete task by ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Task successfully deleted',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Task not found' })
  @ApiParam({ name: 'id', type: Number, description: 'ID of the task' })
  @Roles(RoleName.ADMIN, RoleName.MANAGER)
  @UseGuards(RoleGuard)
  @Delete(':id')
  remove(
    @Param('id') id: number,
    @User() user,
    @Param('projectId', ParseIntPipe) projectId: number,
  ): Promise<DeleteResult> {
    return this.taskService.remove(id, user.id, projectId);
  }

  @ApiOperation({ summary: 'Get filtered tasks' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tasks successfully retrieved',
    type: [Task],
  })
  @ApiQuery({
    name: 'sortDate',
    type: String,
    required: false,
    description: 'Sort date direction (ASC or DESC)',
  })
  @ApiQuery({
    name: 'status',
    enum: TaskStatus,
    required: false,
    description: 'Task status filter',
  })
  @Roles(RoleName.ADMIN, RoleName.MANAGER, RoleName.USER)
  @UseGuards(RoleGuard)
  @Get()
  async getTasks(
    @Query('sortDate') sortDate: string = 'ASC',
    @Query('status') status?: TaskStatus,
  ): Promise<Task[]> {
    const validSortDate: 'ASC' | 'DESC' = sortDate === 'DESC' ? 'DESC' : 'ASC';
    return this.taskService.findWithFilters(validSortDate, status);
  }
}
