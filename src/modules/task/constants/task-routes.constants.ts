export const TASK_CONTROLLER = 'projects/:projectId/tasks' as const;

export const TASK_ROUTES = {
  CREATE: '',
  GET_BY_ID: ':id',
  UPDATE: ':id',
  DELETE: ':id',
  FILTERED: '',
} as const;
