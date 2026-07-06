import { LOGGER_URL} from "../constants";
import build from "pino-abstract-transport";
import { createHttpClient } from "./http-client";
import { DeviceInfo } from "../utils/types";


module.exports = async function (options: {
  baseUrl: string,
  service: string,
  source: string,
  device:DeviceInfo
}) {
  
  const httpClient = createHttpClient(
    options.baseUrl
  );
  return build(async function (source: any) {
    for await (const log of source) {
      try {
        if (log.level < 50) {
          continue;
        }

        const userId =
          log.request?.headers?.["x-user-id"] || null;

        const userType =
          log.request?.headers?.["x-user-type"] || null;

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
            appVersion:options.device.appVersion,
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
        await httpClient.post(
          LOGGER_URL,
          payload
        );
      } catch (error) {
        process.stderr.write(
          "[LOGGER SDK] Failed to send log\n"
        );
      }
    }
  });
};