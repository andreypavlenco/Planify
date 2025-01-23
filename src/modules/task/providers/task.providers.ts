import { Task } from 'src/entities/task.entity';
import { createProvider } from 'src/common/providers/providers.factory';
import { PROVIDER_TOKENS } from 'src/common/constants/provider.tokens';

export const taskProviders = [createProvider(PROVIDER_TOKENS.TASK, Task)];
