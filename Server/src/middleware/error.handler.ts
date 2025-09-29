import { Request, Response } from "express";
import { CustomError } from "../lib/error";
import logger from "../logger";

export const errorHandler = (err: Error, req: Request, res: Response) => {
  if (err instanceof CustomError) {
    const str = err
      .serializeErrors()
      .map((elm) => (elm?.field ? `${elm.field}-${elm.message};` : `${elm.message}`))
      .join();
    logger.error({ ...err, message: str });
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }
  logger.error(typeof err === "string" ? err : JSON.stringify(err));
  res.status(500).send({
    errors: [{ message: "Something went wrong" }],
  });
};

/**
 * 404 Not Found middleware.
 */
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).send({
    errors: [{ message: `Route ${req.originalUrl} not found` }],
  });
};
