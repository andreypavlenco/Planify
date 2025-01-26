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
import { TaskService } from './task.service';
import { Task } from 'src/entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { RoleName, TaskStatus } from 'src/common/enums';
import { Roles, User } from 'src/common/decorators';
import { RoleGuard } from '../auth/guards/role.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('projects/:projectId/tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

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
  @Roles(RoleName.ADMIN, RoleName.MANAGER, RoleName.USER)
  @UseGuards(RoleGuard)
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Task> {
    return this.taskService.findById(id);
  }

  @Roles(RoleName.ADMIN, RoleName.MANAGER, RoleName.USER)
  @UseGuards(RoleGuard)
  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateTaskDto): Promise<Task> {
    return this.taskService.update(id, dto);
  }

  @Roles(RoleName.ADMIN, RoleName.MANAGER)
  @UseGuards(RoleGuard)
  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.taskService.remove(id);
  }

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
