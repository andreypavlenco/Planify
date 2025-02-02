export const PROJECT_CONTROLLER = 'projects' as const;

export const PROJECT_ROUTES = {
  CREATE: '',
  GET_BY_ID: ':id',
  UPDATE: ':projectId',
  DELETE: ':projectId',
  DETAILS: ':projectId/details',
  FILTER: '',
} as const;
