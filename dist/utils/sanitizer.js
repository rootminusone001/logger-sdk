"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeHeaders = sanitizeHeaders;
exports.sanitizeBody = sanitizeBody;
const constants_1 = require("../constants");
function sanitizeHeaders(headers) {
    const copy = { ...headers };
    for (const key of constants_1.SENSITIVE_HEADERS) {
        delete copy[key];
    }
    return copy;
}
function sanitizeBody(body) {
    if (!body || typeof body !== "object") {
        return body;
    }
    const copy = { ...body };
    for (const field of constants_1.SENSITIVE_BODY_FIELDS) {
        if (field in copy) {
            copy[field] = "***";
        }
    }
    return copy;
}
