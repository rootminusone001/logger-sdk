"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SENSITIVE_BODY_FIELDS = exports.SENSITIVE_HEADERS = exports.FRONTEND = exports.FLUSH_INTERVALS_MS = exports.FRONTEND_LOG_BATCH_SIZE = exports.LOG_LEVEL = exports.BATCH_LOGGER_URL = exports.LOGGER_URL = void 0;
exports.LOGGER_URL = '/api/logging/logs';
exports.BATCH_LOGGER_URL = '/api/logging/logs-batch';
exports.LOG_LEVEL = 'error';
exports.FRONTEND_LOG_BATCH_SIZE = 20;
exports.FLUSH_INTERVALS_MS = 10000;
exports.FRONTEND = 'frontend';
exports.SENSITIVE_HEADERS = [
    "authorization",
    "cookie",
    "set-cookie",
    "x-api-key",
];
exports.SENSITIVE_BODY_FIELDS = [
    "password",
    "confirmPassword",
    "otp",
    "token",
    "refreshToken",
];
