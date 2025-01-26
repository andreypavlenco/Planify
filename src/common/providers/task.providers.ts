import { Task } from 'src/entities/task.entity';
import { createProvider } from './providers.factory';
import { PROVIDER_TOKENS } from '../constants';

export const TaskProviders = [createProvider(PROVIDER_TOKENS.TASK, Task)];
