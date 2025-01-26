import { PROVIDER_TOKENS } from 'src/common/providers/provider.tokens';
import { createProvider } from 'src/common/providers/providers.factory';
import { User } from 'src/entities/user.entity';

export const UserProviders = [createProvider(PROVIDER_TOKENS.USER, User)];
