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
import { TaskService } from './task.service';
import { Task } from 'src/entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus } from 'src/common/enums';

@Controller('projects/:projectId/tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  //   @Post()
  //   create(
  //     @Param('projectId') projectId: number,
  //     @Body() dto: CreateTaskDto,
  //   ): Promise<Task> {
  //     return this.taskService.create(projectId, dto);
  //   }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Task> {
    return this.taskService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateTaskDto): Promise<Task> {
    return this.taskService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.taskService.remove(id);
  }

  @Get()
  async getTasks(
    @Query('sortDate') sortDate: string = 'ASC',
    @Query('status') status?: TaskStatus,
  ): Promise<Task[]> {
    const validSortDate: 'ASC' | 'DESC' = sortDate === 'DESC' ? 'DESC' : 'ASC';
    return this.taskService.findWithFilters(validSortDate, status);
  }
}
