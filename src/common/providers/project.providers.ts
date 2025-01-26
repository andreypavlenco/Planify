import { PROVIDER_TOKENS } from 'src/common/providers/provider.tokens';
import { createProvider } from 'src/common/providers/providers.factory';
import { Project } from 'src/entities/project.entity';

export const ProjectProviders = [
  createProvider(PROVIDER_TOKENS.PROJECT, Project),
];
