import axios, { AxiosError, AxiosRequestConfig } from "axios";
import http from "http";
import https from "https";

interface RetryOptions {
  maxRetries?: number;
  retryDelayMs?: number;
}

type RetryableConfig = AxiosRequestConfig & {
  __retryCount?: number;
  __isRetry?: boolean;
};


function shouldRetry(error: AxiosError): boolean {
  const status = error.response?.status;
  return !status || status === 408 || status === 429 || status >= 500;
}

/**
 * Creates a batch-capable axios client with connection pooling and retry support.
 */
export function createBatchHttpClient(baseUrl: string, retryOptions: RetryOptions = {}) {
  const client = axios.create({
    baseURL: baseUrl,
    timeout: 5000,
    httpAgent: new http.Agent({
      keepAlive: true,
      maxSockets: 50,
    }),
    httpsAgent: new https.Agent({
      keepAlive: true,
      maxSockets: 50,
    }),
  });

  const maxRetries = retryOptions.maxRetries ?? 3;
  const retryDelayMs = retryOptions.retryDelayMs ?? 250;

  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const config = error.config as RetryableConfig | undefined;
      if (!config || config.__isRetry || (config.__retryCount ?? 0) >= maxRetries || !shouldRetry(error)) {
        return Promise.reject(error);
      }

      config.__retryCount = (config.__retryCount ?? 0) + 1;
      config.__isRetry = true;
      const delay = retryDelayMs * 2 ** (config.__retryCount - 1);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return client.request(config);
    }
  );

  return client;
}
