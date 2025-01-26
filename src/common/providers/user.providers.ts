import { PROVIDER_TOKENS } from '../constants';
import { createProvider } from './providers.factory';
import { User } from 'src/entities/user.entity';

export const UserProviders = [createProvider(PROVIDER_TOKENS.USER, User)];
