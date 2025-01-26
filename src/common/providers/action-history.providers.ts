import { ActionHistory } from 'src/entities/action-history.entity';
import { PROVIDER_TOKENS } from '../constants';
import { createProvider } from 'src/common/providers/providers.factory';

export const ActionHistoryProviders = [
  createProvider(PROVIDER_TOKENS.ACTION_HISTORY, ActionHistory),
];
