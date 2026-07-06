import { LOG_LEVEL} from "../constants";
import { LoggerConfigOptions } from "../utils/types";


export function createLoggerConfig({
  baseUrl,
  service,
  source,
  device,
}: LoggerConfigOptions) {
   if (!baseUrl) {
    throw new Error(
      "Logger baseUrl is required"
    );
  }

  if (!service) {
    throw new Error(
      "Logger service is required"
    );
  }
  const path = require.resolve("./transporter.js");
console.log("Resolved transporter path:", path);
  return {
    level: LOG_LEVEL,
    transport: {
      target: path,
      options: {
        baseUrl,
        service,
        source,
        device: device || {},
      },
    },

  };
}