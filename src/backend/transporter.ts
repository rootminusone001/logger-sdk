import build from "pino-abstract-transport";
import { createHttpClient } from "./http-client";
import type { DeviceInfo } from "../utils/types";

const LEVEL_VALUES: Record<string, number> = {
  trace: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60,
};

function resolveMinLevel(minLevel?: string | number): number {
  if (typeof minLevel === "number") {
    return minLevel;
  }

  if (typeof minLevel === "string") {
    const normalized = minLevel.toLowerCase();
    if (LEVEL_VALUES[normalized] !== undefined) {
      return LEVEL_VALUES[normalized];
    }

    const parsed = Number.parseInt(normalized, 10);
    return Number.isFinite(parsed) ? parsed : 50;
  }

  return 50;
}

module.exports = async function (options: {
  baseUrl: string;
  service: string;
  source: string;
  device: DeviceInfo;
}) {
  const httpClient = createHttpClient(options.baseUrl);

  return build(async function (source: any) {
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
            platform: options.device?.platform,
            osVersion: options.device?.osVersion,
            appVersion: options.device?.appVersion,
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
        await httpClient.post("", payload);
      } catch (error) {
        process.stderr.write(`[LOGGER SDK] Failed to send log:${error}\n`);
      }
    }
  });
};
