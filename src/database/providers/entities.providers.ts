import { ActionHistory } from 'src/entities/action-history.entity';
import { PROVIDER_TOKENS } from '../../common/constants';
import { createProvider } from 'src/database/providers/providers.factory';
import { Project } from 'src/entities/project.entity';
import { Role } from 'src/entities/role.entity';
import { Task } from 'src/entities/task.entity';
import { User } from 'src/entities/user.entity';

export const ActionHistoryProviders = [
  createProvider(PROVIDER_TOKENS.ACTION_HISTORY, ActionHistory),
];
export const ProjectProviders = [
  createProvider(PROVIDER_TOKENS.PROJECT, Project),
];
export const RoleProviders = [createProvider(PROVIDER_TOKENS.ROLE, Role)];
export const TaskProviders = [createProvider(PROVIDER_TOKENS.TASK, Task)];
export const UserProviders = [createProvider(PROVIDER_TOKENS.USER, User)];
