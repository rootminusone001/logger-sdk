import { FastifyRequest } from "fastify";
import { RequestContext } from "../utils/types";
export declare function buildErrorPayload(request: RequestContext, error: unknown, service: string, level: string): {
    service: string;
    level: string;
    request: {
        id: string | undefined;
        url: string | undefined;
        method: string | undefined;
        headers: {
            [x: string]: any;
        };
        params: any;
        query: any;
        body: any;
    };
    err: unknown;
};
export declare function logError({ request, error, service, level }: {
    request: FastifyRequest;
    error: unknown;
    service: string;
    level: string;
}): void;
//# sourceMappingURL=error-logger.d.ts.map