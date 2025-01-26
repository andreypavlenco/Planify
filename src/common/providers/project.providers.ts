import { Project } from 'src/entities/project.entity';
import { createProvider } from './providers.factory';
import { PROVIDER_TOKENS } from '../constants';

export const ProjectProviders = [
  createProvider(PROVIDER_TOKENS.PROJECT, Project),
];
