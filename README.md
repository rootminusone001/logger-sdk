# Logging SDK Usage Guide

## Overview

This SDK provides logging capabilities for both backend/microservices and frontend applications. It supports structured logging with automatic batching for optimal performance.



## Update Guide

### Step 1:
run command:

```bash
npm run build
```

### Step 2:
commmit dist/ folder


## Backend / Microservice Integration

### Step 1: Install the SDK

Add the SDK dependency to your `package.json`.

Make the pino,pino abstarct,@rootminus/logging-sdk and thread-stream as external dependencies in your build script:
```json
{
    "scripts": {
        "type-check": "tsc --noEmit",
        "dev": "ts-node-dev --respawn --transpile-only -r tsconfig-paths/register src/app.ts",
        "build": "esbuild src/app.ts --bundle --platform=node --target=node18 --outfile=dist/app.cjs --external:fsevents --external:@rootminus/logging-sdk --external:pino --external:thread-stream --external:pino-abstract-transport"
    }
}

Install dependencies:

```bash
npm install
```

### Important Notes

The SDK is currently being consumed from the `development` branch. Once a stable release is available, update the branch reference accordingly.

If the SDK code is updated and you want to pull the latest version:

Option 1:

Delete the SDK entry from `package-lock.json` and run:

```bash
npm install
```

Option 2:

Remove the package from `node_modules` and run:

```bash
npm install
```

This will fetch the latest code from the configured Git branch.

---

### Step 2: Configure Fastify Logger

In your `server.ts` file:

```ts
import { createLoggerConfig } from "@rootminus/logging-sdk/backend";

const server = fastify({
  logger: createLoggerConfig({
    baseUrl: config.logBaseUrl,
    service: "spear-products",
    source: "backend",
    device: {
      platform: "node",
      osVersion: process.version,
      appVersion: process.env.npm_package_version,
    },
  }),
}).withTypeProvider<ZodTypeProvider>();
```

---

### Step 3: Log Errors

Use the `logError` helper inside your service or controller files.

```ts
import { logError } from "@rootminus/logging-sdk/backend";

try {
  // Business logic
} catch (error) {
  logError({
    request,
    error,
    service: process.env.SERVICE_NAME!,
    level: "error",
  });
}
```

---

# Frontend Integration

The frontend logger supports batching to reduce the number of API calls sent to the logging service.

## Step 1: Initialize Logger

```ts
import { FrontendLogger } from "@rootminus/logging-sdk/frontend";

const logger = new FrontendLogger({
  endpoint: config.logBaseUrl,
  batchSize: config.batchSize,
  flushIntervalMs: config.flushIntervalMs,
});
```

### Configuration

| Property        | Description                               |
| --------------- | ----------------------------------------- |
| endpoint        | Logging service base URL                  |
| batchSize       | Number of logs to collect before sending  |
| flushIntervalMs | Maximum time to wait before flushing logs |

---

## Step 2: Log Events

```ts
logger.log({
  level: "error",
  message: error.message,
  source: "frontend",
  service: "admin-web",

  device: {
    platform: "web",
    appVersion: "1.0.0",
  },

  stackTrace: error.stack,

  metadata: {
    page: "/dashboard",
  },
});
```

---

