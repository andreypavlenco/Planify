import { ActionHistory } from 'src/database/entities/action-history.entity';
import { PROVIDER_TOKENS } from '../../common/constants';
import { createProvider } from 'src/database/providers/providers.factory';
import { Project } from 'src/database/entities/project.entity';
import { Role } from 'src/database/entities/role.entity';
import { Task } from 'src/database/entities/task.entity';
import { User } from 'src/database/entities/user.entity';

export const ActionHistoryProviders = [
  createProvider(PROVIDER_TOKENS.ACTION_HISTORY, ActionHistory),
];
export const ProjectProviders = [
  createProvider(PROVIDER_TOKENS.PROJECT, Project),
];
export const RoleProviders = [createProvider(PROVIDER_TOKENS.ROLE, Role)];
export const TaskProviders = [createProvider(PROVIDER_TOKENS.TASK, Task)];
export const UserProviders = [createProvider(PROVIDER_TOKENS.USER, User)];
