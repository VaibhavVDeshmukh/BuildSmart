import { NextFunction, Request, Response } from "express";
import { RequestValidationError } from "../../lib/error";
import { ZodSchema, z } from "zod";
import logger from "../../logger";

type InferBodyParams<T> = T extends z.Schema<infer U> ? U : never;

/**
 * validates req body
 * @param schema
 * @returns
 */
export const validateRequestBody = <T>(schema: ZodSchema<T>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body) as InferBodyParams<typeof schema>;
      next();
    } catch (error: any) {
      throw new RequestValidationError(error);
      // res.status(400).json({ error: error });
    }
  };
};
/**
 *  Validates request query
 * @param schema
 * @returns
 *
 *
 */
export const validateRequestQueryParam = <T>(schema: ZodSchema<T>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.query);
      next();
    } catch (error: any) {
      logger.info({ error });
      throw new RequestValidationError(error);

      // res.status(400).json({ error: "Invalid query parameters" });
    }
  };
};

/**
 * validates req params
 * @param schema
 * @returns
 */
export const validateRequestPathParam = <T>(schema: ZodSchema<T>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.params);
      if (req.params.projectId) {
        req.projectId = req.params.projectId;
      } else {
      }
      next();
    } catch (error: any) {
      throw new RequestValidationError(error);
      // res.status(400).json({ error: "Invalid path parameters" });
    }
  };
};

export const validateRequestHeaders = <T>(schema: ZodSchema<T>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.headers);
      next();
    } catch (error: any) {
      throw new RequestValidationError(error);
    }
  };
};
