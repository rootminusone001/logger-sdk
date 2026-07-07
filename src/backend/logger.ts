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
const transporterPath = path.join(__dirname, "transporter.js");
  return {
    level: LOG_LEVEL,
    transport: {
      target: transporterPath,
      options: {
        baseUrl,
        service,
        source,
        device: device || {},
      },
    },

  };
}
