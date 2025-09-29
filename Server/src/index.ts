// 🔹 Exit events
process.on('beforeExit', (code) => {
  console.log('beforeExit with code:', code);
});

process.on('exit', (code) => {
  console.log('exit with code:', code);
});

// 🔹 Error / Exception events
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1); // usually exit after logging
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('rejectionHandled', (promise) => {
  console.warn('A promise rejection was handled later:', promise);
});

process.on('multipleResolves', (type, promise, reason) => {
  console.warn('Multiple resolves detected:', type, reason);
});

// 🔹 Signal events (Ctrl+C, kill, etc.)
process.on('SIGINT', () => {
  console.log('Caught SIGINT (Ctrl+C), exiting...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Caught SIGTERM, shutting down...');
  process.exit(0);
});

import config from "./config";
import logger from "./logger";
import prisma from "./services/prisma.service";
import { readFileSync } from "fs";
import https from "https";
import express, { Application } from "express";
import cors from "cors";
import compression from "compression";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger.config";
import helmet from "helmet";
import { errorHandler, notFoundHandler } from "./middleware/error.handler";
// import { morganMiddleware } from "./middleware/morgan.middleware";
import v1Router from "./routes/v1/api.routes";
import AuthGuard from "./middleware/auth/auth.guard";
import v2Router from "./routes/v2/api.routes";
import { startScheduler } from "./cron-jobs/scheduler";



const app: Application = express();

// 🔐 Security Middleware
app.use(helmet());

// 📦 Enable GZIP compression
app.use(compression());

// 📝 Logger
// app.use(morganMiddleware);

// 🌐 CORS
app.use(cors({ origin: "*" }));

// 🧠 Body Parsers
app.use(express.json({ limit: "10mb" }));

app.use(express.urlencoded({ extended: true }));

// 🧪 Health check
app.get("/health", (_req, res) => res.status(200).send("OK"));

// 📌 API Routes for s2m app
app.use("/api/v1", AuthGuard.verifySubscription, AuthGuard.verifyRealmAccess(config.realm), v1Router);

// 📌 API Routes for s2m support app
app.use("/api/v2", AuthGuard.verifySupportRealmToken, AuthGuard.verifyRealmAccess(config.supportAppRealm), v2Router);

// 📃Swagger documentation
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ❌ 404 - Not Found
app.use(notFoundHandler);

// 🚨 Global Error Handler
app.use(errorHandler);

startScheduler();

async function startServer() {
  try {
    await prisma.$connect();

    const port = config.port;
    const ip = "0.0.0.0";

    if (config.selfSignedSSl) {
      const options = {
        key: readFileSync("./certs/server.key"),
        cert: readFileSync("./certs/server.crt"),
      };

      https.createServer(options, app).listen(port, ip, () => {
        console.log(`🚀 HTTP Server ready at http://${ip}:${port}`);
        logger.info(`🚀 HTTPS Server ready at https://${ip}:${port}`);
        logger.info(`📘 Swagger docs at https://${ip}:${port}/docs`);
      });
    } else {
      app.listen(port, ip, () => {
        console.log(`🚀 HTTP Server ready at http://${ip}:${port}`);
        logger.info(`🚀 HTTP Server ready at http://${ip}:${port}`);
        logger.info(`📘 Swagger docs at http://${ip}:${port}/docs`);
      });
    }
    logger.info("🐰 Step 5: Starting RabbitMQ consumer...");
  } catch (err) {
    logger.error("❌ Failed to start application", err);
    console.log(err)
    process.exit(1);
  }
}

(async () => {
  try {
    await startServer();
  } catch (err) {
    if (err instanceof Error) {
      logger.error("❌ Top-level error during server bootstrap:", err.stack || err.message);
    } else {
      logger.error("❌ Top-level error during server bootstrap:", err);
    }
    process.exit(1);
  }
})();
