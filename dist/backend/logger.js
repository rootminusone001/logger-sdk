"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLoggerConfig = createLoggerConfig;
const constants_1 = require("../constants");
function createLoggerConfig({ baseUrl, service, source, device, }) {
    if (!baseUrl) {
        throw new Error("Logger baseUrl is required");
    }
    if (!service) {
        throw new Error("Logger service is required");
    }
    const path = require.resolve("./transporter.js");
    console.log("Resolved transporter path:", path);
    return {
        level: constants_1.LOG_LEVEL,
        transport: {
            target: path,
            options: {
                baseUrl,
                service,
                source,
                device: device || {},
            },
        },
    };
}
