import morgan from "morgan";
import logger from "../logger";

// Create a writable stream for morgan to send logs to Winston
export const morganMiddleware = morgan("combined", {
  stream: {
    write: (message: string) => logger.info(message.trim()),
  },
});
