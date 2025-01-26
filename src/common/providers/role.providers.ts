import { createProvider } from 'src/common/providers/providers.factory';
import { PROVIDER_TOKENS } from 'src/common/providers/provider.tokens';
import { Role } from 'src/entities/role.entity';

export const RoleProviders = [createProvider(PROVIDER_TOKENS.ROLE, Role)];
