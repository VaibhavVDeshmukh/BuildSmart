import { CustomError } from "./custom-error";

export class MinioError extends CustomError {
  statusCode = 500;
  constructor(public error: any) {
    super("Mino error");
    Object.setPrototypeOf(this, MinioError.prototype);
  }
  serializeErrors(): { message: string; field?: string | undefined }[] {
    let message = "Oops, Something went wrong! on minio";
    if (this.error?.code === "ECONNREFUSED") {
      message = "Can't connect to minio";
      this.statusCode = 500;
    }
    if (this.error?.code === "NoSuchKey") message = "Object not found";
    if (this.error?.code === "NoSuchBucket") message = "Bucket not found";

    return [{ message }];
  }
}
