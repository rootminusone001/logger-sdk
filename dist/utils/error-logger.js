"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildErrorPayload = buildErrorPayload;
exports.logError = logError;
const sanitizer_1 = require("../utils/sanitizer");
function buildErrorPayload(request, error, service, level) {
    return {
        service,
        level: level,
        request: {
            id: request.id,
            url: request.url,
            method: request.method,
            headers: (0, sanitizer_1.sanitizeHeaders)(request.headers),
            params: request.params,
            query: request.query,
            body: (0, sanitizer_1.sanitizeBody)(request.body),
        },
        err: error,
    };
}
function logError({ request, error, service, level }) {
    request.log.error(buildErrorPayload(request, error, service, level));
}
