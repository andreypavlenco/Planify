import { Role } from 'src/entities/role.entity';
import { createProvider } from './providers.factory';
import { PROVIDER_TOKENS } from '../constants';

export const RoleProviders = [createProvider(PROVIDER_TOKENS.ROLE, Role)];
