export const ERROR_MESSAGES = {
  PROJECT: {
    CREATE_FAILED:
      'Failed to create the project. Please check your input and try again.',
    RETRIEVE_FAILED:
      'Unable to retrieve project details. Please contact support if the issue persists.',
    NOT_FOUND: 'Project not found. Please ensure the project ID is correct.',
    UPDATE_FAILED:
      'Failed to update the project. Verify your changes and try again.',
    DELETE_FAILED:
      'Failed to delete the project. Please contact support if the problem continues.',
  },
  TASK: {
    CREATE_FAILED:
      'Failed to create the task. Ensure all required fields are provided.',
    RETRIEVE_FAILED: 'Unable to retrieve task details. Please try again later.',
    NOT_FOUND: 'Task not found. Please verify the task ID.',
    UPDATE_FAILED:
      'Failed to update the task. Ensure the changes are valid and try again.',
    DELETE_FAILED:
      'Failed to delete the task. Please contact support for assistance.',
  },
  USER: {
    EMAIL_EXISTS:
      'This email is already registered. Please use a different email or log in.',
    CREATE_FAILED:
      'Failed to create the user account. Please verify your input and try again.',
    RETRIEVE_FAILED:
      'Unable to retrieve user information. Please try again later.',
    NOT_FOUND: 'User not found. Ensure the user ID or email is correct.',
    UPDATE_FAILED:
      'Failed to update user details. Please verify the input and try again.',
    ADD_TO_PROJECT_FAILED:
      'Failed to add the user to the project. Please try again.',
    PROJECT_ALREADY_ASSIGNED: 'The user is already assigned to this project.',
    FIND_FAILED:
      'Unable to find the user. Please try again or contact support.',
    CHECK_EMAIL_FAILED:
      'An error occurred while checking the email. Please try again later.',
  },
  DATABASE: {
    CONNECTION_FAILED:
      'Failed to connect to the database. Please check your network connection or contact support.',
  },
  VALIDATION: {
    INVALID_INPUT:
      'Invalid input data. Please correct the errors and try again.',
  },
  AUTH: {
    INVALID_CREDENTIALS:
      'The credentials you provided are incorrect. Please try again.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    TOKEN_EXPIRED: 'Your session has expired. Please log in again.',
    TOKEN_INVALID: 'Authentication token is invalid. Please log in again.',
    LOGIN_FAILED: 'Login failed. Please verify your credentials and try again.',
    LOGOUT_FAILED: 'Logout failed. Please try again.',
    PASSWORD_RESET_FAILED:
      'Unable to reset the password. Please try again later.',
    PASSWORD_RESET_TOKEN_INVALID:
      'The password reset link is invalid or has expired.',
    ACCOUNT_LOCKED:
      'Your account has been locked due to multiple failed login attempts. Please contact support.',
    REGISTRATION_FAILED:
      'Registration failed. Please ensure your details are correct and try again.',
  },
};
