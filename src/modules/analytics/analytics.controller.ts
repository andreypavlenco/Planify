import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { Roles } from 'src/common/decorators';
import { RoleGuard } from '../auth/guards/role.guard';
import { RoleName } from 'src/shared/enums';
import { ANALYTICS_CONTROLLER, ANALYTICS_ROUTES } from './constants';

@ApiTags('Analytics')
@Controller(ANALYTICS_CONTROLLER)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @ApiOperation({ summary: 'Get task count by status for a project' })
  @ApiParam({ name: 'projectId', type: Number, description: 'Project ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the count of tasks grouped by status',
    schema: {
      example: [
        {
          status: 'Completed',
          count: 10,
          tasks: [
            { taskName: 'Fix Bug', assigneeName: 'John Doe' },
            { taskName: 'Implement Feature', assigneeName: 'Jane Doe' },
          ],
        },
      ],
    },
  })
  @Roles(RoleName.ADMIN, RoleName.MANAGER)
  @UseGuards(RoleGuard)
  @Get(ANALYTICS_ROUTES.TASK_STATUS_COUNT)
  async getTaskStatusCount(@Param('projectId') projectId: number) {
    return this.analyticsService.getTaskCountByStatus(projectId);
  }

  @ApiOperation({ summary: 'Get average task completion time for a project' })
  @ApiParam({ name: 'projectId', type: Number, description: 'Project ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the average task completion time in hours',
    schema: {
      example: { averageTime: 12.5 },
    },
  })
  @Roles(RoleName.ADMIN, RoleName.MANAGER)
  @UseGuards(RoleGuard)
  @Get(ANALYTICS_ROUTES.AVERAGE_COMPLETION_TIME)
  async getAverageCompletionTime(@Param('projectId') projectId: number) {
    return this.analyticsService.getAverageTaskCompletionTime(projectId);
  }

  @ApiOperation({ summary: 'Get top 3 active users for a project' })
  @ApiParam({ name: 'projectId', type: Number, description: 'Project ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of top 3 users with the most completed tasks',
    schema: {
      example: [
        { userId: 1, name: 'John Doe', taskCount: 20 },
        { userId: 2, name: 'Jane Doe', taskCount: 18 },
        { userId: 3, name: 'Mike Smith', taskCount: 15 },
      ],
    },
  })
  @Roles(RoleName.ADMIN, RoleName.MANAGER)
  @UseGuards(RoleGuard)
  @Get(ANALYTICS_ROUTES.TOP_ACTIVE_USERS)
  async getTopActiveUsers(@Param('projectId') projectId: number) {
    return this.analyticsService.getTopActiveUsers(projectId);
  }
}
