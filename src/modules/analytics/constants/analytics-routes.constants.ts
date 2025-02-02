export const ANALYTICS_CONTROLLER = 'analytics' as const;

export const ANALYTICS_ROUTES = {
  TASK_STATUS_COUNT: 'task-status-count/:projectId',
  AVERAGE_COMPLETION_TIME: 'average-completion-time/:projectId',
  TOP_ACTIVE_USERS: 'top-active-users/:projectId',
} as const;
