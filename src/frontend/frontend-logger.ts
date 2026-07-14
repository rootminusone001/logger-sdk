import type { LogEventInput, SystemLoggerOptions, DeviceInfo } from "../utils/types";
import { FLUSH_INTERVALS_MS, FRONTEND_LOG_BATCH_SIZE, FRONTEND, BACKEND } from "../constants";
import { createBatchHttpClient } from "./frontend-http-client";




export class SystemLogger {
  private readonly endpoint: string;
  private readonly batchSize: number;
  private readonly flushIntervalMs: number;
  private readonly userType?: string;
  private readonly source: string;
  private readonly deviceInfo: DeviceInfo;
  private readonly httpClient;

  private buffer: LogEventInput[] = [];
  private timer: ReturnType<typeof setInterval> | undefined;
  private flushing = false;



  constructor({
    endpoint,
    batchSize = FRONTEND_LOG_BATCH_SIZE,
    flushIntervalMs = FLUSH_INTERVALS_MS,
    userType,
    source = FRONTEND,
    deviceInfo,
  }: SystemLoggerOptions) {
    this.endpoint = endpoint;
    this.batchSize = batchSize;
    this.flushIntervalMs = flushIntervalMs;
    this.userType = userType;
    this.deviceInfo = deviceInfo || {};
    this.source = source === BACKEND ? BACKEND : FRONTEND;
    this.httpClient = createBatchHttpClient(this.endpoint);

    this.timer = setInterval(() => {
      void this.flush();
    }, this.flushIntervalMs);
  }

  log(event: LogEventInput): void {
    this.buffer.push({
      ...event,
      source: this.source,
      userType: this.userType ?? null,
      device: this.deviceInfo,
      eventTimestamp: event.eventTimestamp ?? new Date().toISOString(),
    });

    if (this.buffer.length >= this.batchSize) {
      void this.flush();
    }
  }

  async flush(): Promise<void> {
    if (this.buffer.length === 0 || this.flushing) {
      return;
    }

    this.flushing = true;
    const batch = [...this.buffer];

    try {
      await this.httpClient.post("", batch);
      this.buffer.splice(0, batch.length);
    } catch (error) {
      console.error("Error while flushing logs", error);
    } finally {
      this.flushing = false;
      if (this.buffer.length > 0) {
        void this.flush();
      }
    }
  }

  async shutdown(): Promise<void> {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }

    await this.flush();
  }

  destroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }

    void this.flush();
  }
}
