import { AuthPayload, UserPayload } from "../../middleware/auth/types";
declare module "express-serve-static-core" {
  interface Request {
    user?: AuthPayload & UserPayload;
    projectId?: string;
  }
}
