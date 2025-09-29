import { createLogger, format, transports } from "winston";
import { extensions, winstonAzureBlob } from "winston-azure-blob";
import DailyRotateFile from "winston-daily-rotate-file";
import config from "./config";
import SentryTransport from "./sentry/winstonSentry";
const loggerFormat = format.combine(
  format.timestamp({
    format: "DD-MM-YYYY HH:mm:ss",
  }),
  format.json(),
);
const consoleFormat = format.combine(format.colorize({ level: true }), format.simple());
const logger = createLogger({
  transports: [
    new DailyRotateFile({
      filename: "logs/errors-%DATE%.json",
      datePattern: "DD-MM-YYYY",
      level: "error",
      format: loggerFormat,
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
    new SentryTransport({
      dsn: config.sentryDsn,
      patchGlobal: true,
      levelsMap: {
        silly: "debug",
        verbose: "debug",
        info: "info",
        debug: "debug",
        warn: "warning",
        error: "error",
      },
      tags: { environment: process.env.NODE_ENV || "development" },
    }),
  ],

  exceptionHandlers: [
    new DailyRotateFile({
      filename: "logs/exceptions-%DATE%.json",
      datePattern: "DD-MM-YYYY",
      format: loggerFormat,
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
  ],
});
if (process.env.NODE_ENV === "production") {
  // To be added with file rotation and zip
  logger.add(
    winstonAzureBlob({
      account: { connectionString: config.azureObjectConString },
      blobName: "s2m-server-name",
      bufferLogSize: 1,
      containerName: "common",
      eol: "\n",
      extension: extensions.LOG,
      level: "error",
    })
  );
}
if (process.env.NODE_ENV === "development") logger.add(new transports.Console({ format: consoleFormat }));

export default logger;
