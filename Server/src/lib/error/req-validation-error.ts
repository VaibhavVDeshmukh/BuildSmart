import { ZodError } from "zod";
import { CustomError } from "./custom-error";
export class RequestValidationError extends CustomError {
  statusCode = 400;
  constructor(public error: ZodError) {
    super("Invalid request parameter");
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }
  serializeErrors(): { message: string; field?: string | undefined }[] {
    return this.error?.issues?.map((issue) => {
      return {
        message: issue?.message,
        field: issue?.path?.join("."),
      };
    });
  }
}
