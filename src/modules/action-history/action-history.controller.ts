import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ActionHistoryService } from './action-history.service';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from 'src/common/decorators';
import { RoleName } from 'src/common/enums';

@Controller('projects/:projectId/history')
export class ActionHistoryController {
  constructor(private readonly actionHistoryService: ActionHistoryService) {}

  @Roles(RoleName.ADMIN, RoleName.MANAGER)
  @UseGuards(RoleGuard)
  @Get()
  async getActionHistory(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.actionHistoryService.findByProject(projectId);
  }
}
