// /* eslint-disable @typescript-eslint/ban-ts-comment */
// import { Request, Response, NextFunction } from "express";
// import userHandler from "../../handler/user.handler";
// import jwt from "jsonwebtoken";
// import config from "../../config";
// import { AppClient, AuthPayload } from "./types";
// import authHandler from "../../handler/auth.handler";
// import { BadRequestError, NotAuthenticated, NotAuthorizedError } from "../../lib/error";
// import logger from "../../logger";
// export const isSuperOrAdmin = (roles?: ApplicationRole[]) => (!roles || !roles.length ? false : roles.some((role) => role === ApplicationRole.ADMIN || role === ApplicationRole.SUPER));
// export const isProjectOwnerOrAdmin = (roles?: ProjectRole[]) => (!roles || !roles.length ? false : roles.some((role) => ProjectRole.ADMIN === role || ProjectRole.OWNER === role));
// const checkEmailOrUserDuplication = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const email: string = req.body.email.toLocaleLowerCase();
//     const emailExist = await userHandler.getByEmail(email);
//     if (emailExist) throw new Error("Email already in use");
//     next();
//   } catch (error) {
//     res.status(400).send({ message: "Email already in use", error });
//     return;
//   }
// };
// const extractAndVerifyToken = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const baererHeader = req.headers["authorization"];
//     const bearer = baererHeader?.split(" ");
//     let token = bearer?.[1];
//     if (!token) {
//       token = req.query.token as string;
//     }
//     if (!token) {
//       logger.error("Missing authorization header");
//       throw new NotAuthenticated();
//     }
//     // @ts-ignore
//     const payload: AuthPayload = await new Promise((resolve, reject) => {
//       if (!token) throw new NotAuthenticated();
//       jwt.verify(token, config.jwtSecret, (err, data) => {
//         if (err) {
//           reject(err);
//         }
//         resolve(data);
//       });
//     }).catch((err) => {
//       logger.error(err);
//       throw new NotAuthenticated();
//     });
//     req.user = payload;
//     return next();
//   } catch (error) {
//     next(error);
//   }
// };
// const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const baererHeader = req.headers["authorization"];
//     if (!baererHeader) {
//       logger.error("Missing authorization header");
//       throw new NotAuthenticated();
//     }
//     const bearer = baererHeader.split(" ");
//     const token = bearer?.[1];
//     if (!token) {
//       logger.error("Missing jwt token");
//       throw new NotAuthenticated();
//     }
//     // @ts-ignore
//     const payload: AuthPayload = await new Promise((resolve, reject) => {
//       jwt.verify(token, config.jwtSecret, (err, data) => {
//         if (err) {
//           reject(err);
//         }
//         resolve(data);
//       });
//     }).catch((err) => {
//       logger.error(err);
//       throw new NotAuthenticated();
//     });

//     // const isActive = await authHandler.isActiveUser(payload.id);
//     // if (!isActive) {
//     //   logger.error("Inactive account");
//     //   throw new NotAuthenticated();
//     // }
//     req.user = payload;
//     return next();
//   } catch (error) {
//     next(error);
//     // res.status(401).send({ message: "Unauthorized" });
//   }
// };
// export const extractProjectId = (req: Request, projectKey: string) => {
//   // @ts-ignore
//   if (req[projectKey]) return req[projectKey];
//   if (req.params[projectKey]) return req.params[projectKey];
//   if (req.query[projectKey]) return req.query[projectKey];
//   if (req.body[projectKey]) return req.body[projectKey];
//   return null;
// };

// export const checkProjectAcess =
//   (requiredRoles: ProjectRole[], projectKey = "projectId") =>
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       if (!req.user) throw new NotAuthorizedError();
//       const projectId = extractProjectId(req, projectKey);
//       const user = req.user;
//       if (!projectId) throw new NotAuthorizedError();
//       if ([ApplicationRole.ADMIN, ApplicationRole.SUPER].some((role) => user.roles.includes(role))) {
//         return next();
//       }
//       const userRole = await authHandler.hasProjectAccess(user.id, projectId);

//       if (!userRole) throw new NotAuthorizedError();
//       req.user.projectRoles = [userRole];
//       if (requiredRoles.length === 0) {
//         next();
//         return;
//       }
//       if (!requiredRoles.includes(userRole)) throw new NotAuthorizedError();
//       next();
//     } catch (error) {
//       next(error);
//     }
//   };
// export const applicationRoleGuard = (requiredRoles: ApplicationRole[]) => {
//   return async (req: Request, _res: Response, next: NextFunction) => {
//     try {
//       const user = req.user;
//       if (!user) throw new NotAuthorizedError();
//       const userRoles = user.roles;
//       if (!userRoles) throw new NotAuthorizedError();
//       if (!requiredRoles.some((role) => userRoles.includes(role))) throw new NotAuthorizedError();
//       next();
//     } catch (error) {
//       next(error);
//     }
//   };
// };
// const verifyResourceAccessToken = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const baererHeader = req.headers["authorization"];
//     if (!baererHeader) throw new BadRequestError("Missing access token");
//     const bearer = baererHeader.split(" ");
//     const token = bearer?.[1];
//     if (!token) throw new NotAuthenticated();
//     // const isTokenValid = await prisma.resourceToken.findFirst({
//     //   where: {
//     //     tokenType: ACCESS_TOKEN,
//     //     token: token,
//     //   },
//     // });
//     // if (!isTokenValid) throw new BadRequestError("Invalid token provided");
//     // @ts-ignore
//     const payload: AuthPayload = jwt.verify(token, config.jwtSecret);
//     req.user = payload;
//     next();
//   } catch (error) {
//     next(error);
//   }
// };

// const verifySingleUseToken = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     logger.info("single token recieved");
//     const baererHeader = req.headers["authorization"];
//     if (!baererHeader) throw new BadRequestError("Missing access token");
//     const bearer = baererHeader.split(" ");
//     const token = bearer?.[1];
//     if (!token) throw new NotAuthorizedError();
//     // const isTokenValid = await prisma.resourceToken.findFirst({
//     //   where: {
//     //     tokenType: SINGLE_USE_TOKEN,
//     //     token: token,
//     //   },
//     // });

//     // @ts-ignore
//     const payload: AuthPayload = jwt.verify(token, config.suJwtSecret);
//     req.user = payload;
//     next();
//   } catch (error) {
//     next(error);
//   }
// };
// const allowedResources = (allowedClients: AppClient[]) => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const user = req.user;
//       if (!user) throw new NotAuthorizedError();
//       const client = user.cleint;
//       if (!client) throw new NotAuthenticated();
//       if (!allowedClients.includes(client)) throw new NotAuthorizedError();
//       next();
//     } catch (error) {
//       next();
//     }
//   };
// };

// export default {
//   checkEmailOrUserDuplication,
//   verifyToken,
//   checkProjectAcess,
//   verifySingleUseToken,
//   verifyResourceAccessToken,
//   allowedResources,
//   applicationRoleGuard,
//   extractAndVerifyToken,
// };
