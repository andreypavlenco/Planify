import { Task } from 'src/entities/task.entity';
import { createProvider } from 'src/common/providers/providers.factory';
import { PROVIDER_TOKENS } from 'src/common/providers/provider.tokens';

export const TaskProviders = [createProvider(PROVIDER_TOKENS.TASK, Task)];
