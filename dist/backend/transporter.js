"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const pino_abstract_transport_1 = __importDefault(require("pino-abstract-transport"));
const http_client_1 = require("./http-client");
module.exports = async function (options) {
    const httpClient = (0, http_client_1.createHttpClient)(options.baseUrl);
    return (0, pino_abstract_transport_1.default)(async function (source) {
        for await (const log of source) {
            try {
                if (log.level < 50) {
                    continue;
                }
                const userId = log.request?.headers?.["x-user-id"] || null;
                const userType = log.request?.headers?.["x-user-type"] || null;
                const payload = {
                    level: log.level ?? "error",
                    message: log.msg || "Unknown error",
                    source: options.source ?? "backend",
                    service: `${options.service}:${log.service}`,
                    userId,
                    userType,
                    device: {
                        platform: options.device.platform,
                        osVersion: options.device.osVersion,
                        appVersion: options.device.appVersion,
                    },
                    stackTrace: log.err?.stack || null,
                    metadata: {
                        requestId: log.request?.id,
                        route: log.request?.url,
                        method: log.request?.method,
                        params: log.request?.params,
                        query: log.request?.query,
                    },
                    eventTimestamp: log.time ? new Date(log.time).toISOString() : new Date().toISOString(),
                };
                await httpClient.post(constants_1.LOGGER_URL, payload);
            }
            catch (error) {
                process.stderr.write("[LOGGER SDK] Failed to send log\n");
            }
        }
    });
};
