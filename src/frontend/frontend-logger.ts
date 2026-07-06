import { LogEventInput, FrontendLoggerOptions, DeviceInfo } from "../utils/types";
import { FLUSH_INTERVALS_MS, FRONTEND_LOG_BATCH_SIZE, BATCH_LOGGER_URL, FRONTEND } from "../constants";
import { createBatchHttpClient } from "./frontend-http-client";




export class FrontendLogger {
  private readonly endpoint: string;
  private readonly batchSize: number;
  private readonly flushIntervalMs: number;
  private userId?: number;
  private readonly userType: string;
  private readonly deviceInfo: DeviceInfo;
  private readonly httpClient;

  private buffer: LogEventInput[] = [];
  private timer: ReturnType<typeof setInterval>;



  constructor({
    endpoint,
    batchSize = FRONTEND_LOG_BATCH_SIZE,
    flushIntervalMs = FLUSH_INTERVALS_MS,
    userType,
    deviceInfo
  }: FrontendLoggerOptions) {
    this.endpoint = endpoint;
    this.batchSize = batchSize;
    this.flushIntervalMs = flushIntervalMs;
    this.userType = userType;
    this.deviceInfo = deviceInfo;
    this.httpClient =
      createBatchHttpClient(this.endpoint);

    this.timer = setInterval(() => {
      void this.flush();
    }, this.flushIntervalMs);

  }

  log(event: LogEventInput): void {
    this.buffer.push({
      ...event,
      source: FRONTEND,
      userType: this.userType,
      device: this.deviceInfo,
      eventTimestamp:
        event.eventTimestamp ??
        new Date().toISOString(),
    });

    if (this.buffer.length >= this.batchSize) {
      void this.flush();
    }
  }

  async flush(): Promise<void> {
    if (this.buffer.length === 0) {
      return;
    }

    const batch = [...this.buffer];

    try {
      await this.httpClient.post(BATCH_LOGGER_URL, batch);
      this.buffer.splice(0, batch.length);
    } catch (error) {
      console.log('Error while flushing logs', error);
    }
  }

  destroy(): void {
    clearInterval(this.timer);
  }
}