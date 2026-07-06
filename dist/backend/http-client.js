"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHttpClient = createHttpClient;
const axios_1 = __importDefault(require("axios"));
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
function createHttpClient(baseUrl) {
    return axios_1.default.create({
        baseURL: baseUrl,
        timeout: 5000,
        httpAgent: new http_1.default.Agent({
            keepAlive: true,
            maxSockets: 50,
        }),
        httpsAgent: new https_1.default.Agent({
            keepAlive: true,
            maxSockets: 50,
        }),
    });
}
