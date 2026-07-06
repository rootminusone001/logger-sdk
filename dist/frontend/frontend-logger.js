"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FrontendLogger = void 0;
const constants_1 = require("../constants");
const frontend_http_client_1 = require("./frontend-http-client");
class FrontendLogger {
    constructor({ endpoint, batchSize = constants_1.FRONTEND_LOG_BATCH_SIZE, flushIntervalMs = constants_1.FLUSH_INTERVALS_MS, userType, deviceInfo }) {
        this.buffer = [];
        this.endpoint = endpoint;
        this.batchSize = batchSize;
        this.flushIntervalMs = flushIntervalMs;
        this.userType = userType;
        this.deviceInfo = deviceInfo;
        this.httpClient =
            (0, frontend_http_client_1.createBatchHttpClient)(this.endpoint);
        this.timer = setInterval(() => {
            void this.flush();
        }, this.flushIntervalMs);
    }
    log(event) {
        this.buffer.push({
            ...event,
            source: constants_1.FRONTEND,
            userType: this.userType,
            device: this.deviceInfo,
            eventTimestamp: event.eventTimestamp ??
                new Date().toISOString(),
        });
        if (this.buffer.length >= this.batchSize) {
            void this.flush();
        }
    }
    async flush() {
        if (this.buffer.length === 0) {
            return;
        }
        const batch = [...this.buffer];
        try {
            await this.httpClient.post(constants_1.BATCH_LOGGER_URL, batch);
            this.buffer.splice(0, batch.length);
        }
        catch (error) {
            console.log('Error while flushing logs', error);
        }
    }
    destroy() {
        clearInterval(this.timer);
    }
}
exports.FrontendLogger = FrontendLogger;
