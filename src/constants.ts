export const LOGGER_URL='/api/logging/logs';
export const BATCH_LOGGER_URL='/api/logging/logs-batch';
export const LOG_LEVEL='error';
export const FRONTEND_LOG_BATCH_SIZE = 20;
export const FLUSH_INTERVALS_MS = 10000;
export const FRONTEND = 'frontend';
export const SENSITIVE_HEADERS = [
  "authorization",
  "cookie",
  "set-cookie",
  "x-api-key",
];

export const SENSITIVE_BODY_FIELDS = [
  "password",
  "confirmPassword",
  "otp",
  "token",
  "refreshToken",
];
