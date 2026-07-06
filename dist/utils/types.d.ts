import { FastifyRequest } from "fastify";
export interface DeviceInfo {
    platform?: string;
    osVersion?: string;
    appVersion?: string;
}
export interface LogEvent {
    level: "info" | "warn" | "error" | "fatal";
    message: string;
    source?: string | null;
    service: string;
    userId?: string | null;
    userType?: string | null;
    stackTrace?: string | null;
    metadata?: Record<string, any>;
    device?: DeviceInfo;
    eventTimestamp: string;
}
export type LogEventInput = Omit<LogEvent, "eventTimestamp"> & {
    eventTimestamp?: string;
};
export interface CaptureErrorInput {
    request: FastifyRequest;
    error: unknown;
    service: string;
}
export interface RequestContext {
    id?: string;
    url?: string;
    method?: string;
    headers?: Record<string, any>;
    params?: any;
    query?: any;
    body?: any;
}
export interface LoggerConfigOptions {
    baseUrl: string;
    service: string;
    source: string;
    device?: DeviceInfo;
}
export interface FrontendLoggerOptions {
    endpoint: string;
    batchSize?: number;
    flushIntervalMs?: number;
    userType: string;
    source: string;
    deviceInfo: DeviceInfo;
}
//# sourceMappingURL=types.d.ts.map