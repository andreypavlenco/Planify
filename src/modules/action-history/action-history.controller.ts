import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ActionHistoryService } from './action-history.service';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from 'src/common/decorators';
import { RoleName } from 'src/shared/enums';
import { ACTION_HISTORY_CONTROLLER, ACTION_HISTORY_ROUTES } from './constants';

@ApiTags('Action History')
@Controller(ACTION_HISTORY_CONTROLLER)
export class ActionHistoryController {
  constructor(private readonly actionHistoryService: ActionHistoryService) {}

  @ApiOperation({
    summary: 'Get action history for a project',
    description:
      'Retrieves the list of actions performed in a specified project.',
  })
  @ApiParam({
    name: 'projectId',
    type: Number,
    description:
      'The ID of the project whose action history is being retrieved',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'List of action history entries retrieved successfully.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. User does not have the necessary permissions.',
  })
  @ApiResponse({
    status: 404,
    description: 'Project not found.',
  })
  @Roles(RoleName.ADMIN, RoleName.MANAGER)
  @UseGuards(RoleGuard)
  @Get(ACTION_HISTORY_ROUTES.GET_HISTORY)
  async getActionHistory(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.actionHistoryService.findByProject(projectId);
  }
}
