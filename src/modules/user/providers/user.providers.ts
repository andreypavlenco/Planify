import { PROVIDER_TOKENS } from 'src/common/constants/provider.tokens';
import { createProvider } from 'src/common/providers/providers.factory';
import { User } from 'src/entities/user.entity';

export const userProviders = [createProvider(PROVIDER_TOKENS.USER, User)];
