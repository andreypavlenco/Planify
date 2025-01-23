import { PROVIDER_TOKENS } from 'src/common/constants/provider.tokens';
import { createProvider } from 'src/common/providers/providers.factory';
import { Project } from 'src/entities/project.entity';

export const projectProviders = [
  createProvider(PROVIDER_TOKENS.PROJECT, Project),
];
