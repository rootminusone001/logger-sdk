import { LogEventInput, FrontendLoggerOptions } from "../utils/types";
export declare class FrontendLogger {
    private readonly endpoint;
    private readonly batchSize;
    private readonly flushIntervalMs;
    private userId?;
    private readonly userType;
    private readonly deviceInfo;
    private readonly httpClient;
    private buffer;
    private timer;
    constructor({ endpoint, batchSize, flushIntervalMs, userType, deviceInfo }: FrontendLoggerOptions);
    log(event: LogEventInput): void;
    flush(): Promise<void>;
    destroy(): void;
}
//# sourceMappingURL=frontend-logger.d.ts.map