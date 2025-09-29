import { CustomError } from "./custom-error";

export class NotAuthorizedError extends CustomError {
  statusCode = 403;

  constructor() {
    super("Not Authorized");

    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors() {
    return [{ message: "Not authorized" }];
  }
}

export class NotAuthenticated extends CustomError {
  statusCode = 401;
  private errorMessage?: string;

  constructor(errorMessage?: string) {
    super("Not Authenticated");
    Object.setPrototypeOf(this, NotAuthenticated.prototype);
    this.errorMessage = errorMessage;
    if (errorMessage) {
      // log error
      console.log(errorMessage);
    }
  }

  serializeErrors() {
    return [{ message: this.errorMessage || "Not Authenticated" }];
  }
}
