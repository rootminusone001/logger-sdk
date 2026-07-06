import { FastifyRequest } from "fastify";
import { sanitizeBody, sanitizeHeaders } from "../utils/sanitizer";
import { RequestContext } from "../utils/types";

export function buildErrorPayload(
  request: RequestContext,
  error: unknown,
  service: string,
  level: string
) {
  return {
    service,
    level:level,
    request: {
      id: request.id,
      url: request.url,
      method: request.method,
      headers: sanitizeHeaders(
        request.headers as any
      ),
      params: request.params,
      query: request.query,
      body: sanitizeBody(request.body),
    },

    err: error,
  };
}

export function logError({
  request,
  error,
  service,
  level
}: {
  request: FastifyRequest;
  error: unknown;
  service: string;
  level: string;
}) {
  request.log.error(
    buildErrorPayload(request, error, service,level)
  );
}