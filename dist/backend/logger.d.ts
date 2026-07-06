import { LoggerConfigOptions } from "../utils/types";
export declare function createLoggerConfig({ baseUrl, service, source, device, }: LoggerConfigOptions): {
    level: string;
    transport: {
        target: string;
        options: {
            baseUrl: string;
            service: string;
            source: string;
            device: import("../utils/types").DeviceInfo;
        };
    };
};
//# sourceMappingURL=logger.d.ts.map