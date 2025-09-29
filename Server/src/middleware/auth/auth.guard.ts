import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { NotAuthenticated, NotAuthorizedError } from "../../lib/error";
import logger from "../../logger";
import JwksRsa from "jwks-rsa";
import { defineAbilitiesFor } from "./abilities";
import { ForbiddenError } from "@casl/ability";
import config from "../../config";
import { AuthPayload, AuthService, ResourceAction, ResourceClient, UserPayload } from "./types";

export const jwksClient = JwksRsa({
  jwksUri: `${config.keycloakBaseUrl}/realms/${config.realm}/protocol/openid-connect/certs`,
  cache: true,
  cacheMaxAge: 15 * 60,
});

export const jwksSupportClient = JwksRsa({
  jwksUri: `${config.keycloakBaseUrl}/realms/${config.supportAppRealm}/protocol/openid-connect/certs`,
  cache: true,
  cacheMaxAge: 15 * 60,
});

// List of paths that should bypass authentication
const bypassPaths = ["/account/basicAddress"];

// Helper function to check if a route should be bypassed
export const shouldBypassAuth = (path: string): boolean => {
  return bypassPaths.some((prefix) => path.startsWith(prefix));
};

// TokenVerify-->AbilityAttach-->ClientCheck-->Permissions

class AuthGuard {
  /**
   * Extracts the JWT token from the Authorization header.
   *
   * This static method is responsible for extracting the JWT token from the `Authorization` header
   * following the Bearer token scheme. If the header is missing, malformed, or does not contain a
   * valid Bearer token, it throws a `NotAuthenticated` error.
   *
   * @param string [bearerHeader] - The Authorization header from the request. This should follow the format "Bearer <token>".
   * @returns string - Returns the extracted token string.
   *
   * @throws NotAuthenticated - If the Authorization header is missing, malformed, or does not follow the "Bearer <token>" format.
   *
   * @example
   * // Example of how the method is used to extract a token:
   * const bearerHeader = req.headers["authorization"];
   * const token = AuthGuard.extractToken(bearerHeader);
   * console.log(token);  // Outputs the extracted JWT token
   */
  static extractToken(bearerHeader?: string): string {
    if (!bearerHeader) {
      logger.error("Missing authorization in headers");
      throw new NotAuthenticated("Authorization header is missing");
    }
    const parts = bearerHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      throw new NotAuthenticated("Malformed token");
    }
    const token = parts[1];
    return token;
  }

  /**
   * Middleware to verify and authenticate a JWT token from the request's Authorization header.
   *
   * This static method is responsible for extracting, decoding, and verifying the JWT token from the
   * Authorization header of the request. It checks if the token is valid, if the user is active,
   * and whether the token has the required permissions. If valid, the decoded token payload is attached to
   * `req.user`, and the user's abilities are defined. If the token is invalid or the user is inactive,
   * an authentication error is thrown.
   *
   * @param  req - The Express request object, containing the JWT token in the Authorization header.
   * @param  res - The Express response object.
   * @param  next - The Express next middleware function.
   * @returns Promise<void> - Returns a Promise that resolves to call the next middleware if the token is valid, or throws an error if invalid.
   *
   * @throws NotAuthenticated - If the token is invalid, missing, or the user is inactive, it throws a `NotAuthenticated` error.
   *
   * @example
   * // Usage in an Express route:
   * app.get('/protected-route', verifyToken, (req, res) => {
   *   res.send('You are authenticated!');
   * });
   */
  static async verifyToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const baererHeader = req.headers["authorization"];
      const token = AuthGuard.extractToken(baererHeader);
      const decodedToken = jwt.decode(token, { complete: true }) as JwtPayload | null;
      if (!decodedToken || !decodedToken.header || !decodedToken.header?.kid) throw new NotAuthenticated("Invalid token");
      if (!decodedToken.payload?.sub) throw new NotAuthenticated("Invalid token");
      //   NOTE:: Use caching or optimization method for this db call
      // const isActive = await authHandler.isActiveUser(decodedToken.payload.sub);
      // if (!isActive) throw new NotAuthenticated("Inactive account");
      const key = await jwksClient.getSigningKey(decodedToken.header.kid);
      const signinKey = key.getPublicKey();
      try {
        const payload = jwt.verify(token, signinKey, { algorithms: ["RS256"] }) as AuthPayload & UserPayload;
        req.user = payload;
        // req.user.ability = defineAbilitiesFor(payload.permissions ? payload.permissions.split(/_/).map((elm) => parseInt(elm)) : []);
        return next();
      } catch (error) {
        console.log(error);
        throw new NotAuthenticated("Token verification failed");
      }
    } catch (error) {
      console.log(error);
      logger.error("Authentication error:", error);
      next(new NotAuthenticated("Token verification failed"));
    }
  }
  static verifySubscription = async (req: Request, _res: Response, next: NextFunction) => {
    try {
      // Bypass middleware if request path matches any in whitelist
      if (shouldBypassAuth(req.path)) {
        return next();
      }
      const bearerHeader = req.headers["authorization"];
      const token = AuthGuard.extractToken(bearerHeader);
      const decodedToken = jwt.decode(token, { complete: true }) as JwtPayload | null;
      if (!decodedToken || !decodedToken.header || !decodedToken.header?.kid) throw new NotAuthenticated("Invalid token");
      if (!decodedToken.payload?.sub) throw new NotAuthenticated("Invalid token");
      const key = await jwksClient.getSigningKey(decodedToken.header.kid);
      const signinKey = key.getPublicKey();
      try {
        const payload = jwt.verify(token, signinKey, { algorithms: ["RS256"] }) as AuthPayload & UserPayload;
        req.user = payload;
        req.user.id = payload.sub;

        // Get subscription-level permissions
        const permissions = payload.permissions ? payload.permissions.split("_").map(Number) : [];
        let allPermissions = [...permissions];

        if (payload.project && payload.pp) {
          const filteredPermission = allPermissions.filter((num) => num >= 1 && num <= 18);
          // Get project-level permissions
          const projectPermissions = payload.pp.split("_").map(Number);
          allPermissions = [...new Set([...filteredPermission, ...projectPermissions])];
        }

        const ability = defineAbilitiesFor(allPermissions);

        if (ability) {
          req.user.ability = ability;
        }

        return next();
      } catch (error) {
        logger.error("Token verification failed", error);
        throw new NotAuthenticated("Token verification failed");
      }
    } catch (error) {
      logger.error("Token verification failed", error);
      next(error);
    }
  };
  static extractProjectId = (req: Request) => {
    // Check for projectId in params
    if (req.projectId) {
      return req.projectId;
    }
    if (req.params && req.params.projectId) {
      return req.params.projectId;
    }

    // Check for projectId in query
    if (req.query && req.query.projectId) {
      return req.query.projectId;
    }

    // Check for projectId in body
    if (req.body && req.body.projectId) {
      return req.body.projectId;
    }

    // If projectId is not found, return null or undefined
    return null;
  };
  /**
   * Middleware to check if the user has the required abilities for specific actions on a subject.
   *
   * This static method generates an Express middleware function that checks whether the authenticated user
   * has the required permissions (abilities) to perform a set of actions on a specified subject.
   * It uses the user's `ability` object (from CASL) to verify if the user can perform the given actions.
   * If the user lacks the required permissions, a `ForbiddenError` is thrown.
   *
   * @param  subject - The subject (entity) on which the actions are being performed.
   *                                This can be a string or an object that represents a resource, e.g., 'Post', 'User'.
   * @param  actions - An array of actions (permissions) that the user must have on the subject.
   *                                 Actions typically include 'read', 'create', 'update', 'delete', etc.
   * @returns function(Request, Response, NextFunction): void - Returns an Express middleware function that checks
   *                                                             the user's ability to perform the specified actions on the subject.
   *
   * @throws NotAuthorizedError - If the user is not authenticated or does not have an `ability` object in the request.
   * @throws ForbiddenError - If the user lacks the required permissions for any of the provided actions on the subject.
   *
   * @example
   * // Usage in an Express route:
   * app.get('/some-protected-resource', checkAbility('Post', ['read', 'update']), (req, res) => {
   *   res.send('You have the required abilities!');
   * });
   */
  static checkAbility = (subject: AuthService, actions: ResourceAction[], context?: "Subscription" | "Project") => {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!req.user || !req.user.ability) throw new NotAuthorizedError();
        const ability = req.user.ability;
        if (context === "Project") {
          const projectId = AuthGuard.extractProjectId(req);

          if (req.user.project !== projectId) throw new NotAuthorizedError();
        }
        actions.forEach((action) => ForbiddenError.from(ability).throwUnlessCan(action, subject));
        return next();
      } catch (error) {
        console.log(error);
        logger.error("AuthorizationError:", error);
        next(error);
      }
    };
  };

  /**
   * Middleware factory to check if a client's request is authorized.
   *
   * This static method generates an Express middleware function that checks if the request's user is associated
   * with one of the allowed clients. If the client is allowed, the request is passed to the next middleware;
   * otherwise, a `NotAuthorizedError` is thrown.
   *
   * @param  allowedClients - An array of allowed client names. The request will be authorized only if
   *                                            the client's name is present in this list.
   * @returns  function(Request, Response, NextFunction): Promise<void> - Returns an Express middleware function.
   *                                                                                  The middleware checks the client's name
   *                                                                                  and proceeds if allowed, otherwise
   *                                                                                  throws a `NotAuthorizedError`.
   *
   * @throws NotAuthorizedError - If the client is not allowed or if the request's user is not authenticated.
   *
   * @example
   * // Usage in an Express route:
   * app.get('/some-protected-route', isClientAllowed(['client1', 'client2']), (req, res) => {
   *   res.send('You are authorized!');
   * });
   */

  static isClientAllowed = (allowedClients: ResourceClient[]) => () => {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!req.user) throw new NotAuthorizedError();
        const clientName = req.user.clientName;
        if (allowedClients.includes(clientName)) return next();
        throw new NotAuthorizedError();
      } catch (error) {
        next(error);
      }
    };
  };

  // static verifySingleUseToken = async (_req: Request, _res: Response, _next: NextFunction) => {};

  static verifyUploadAccessToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bearerHeader = req.headers["authorization"];
      const token = AuthGuard.extractToken(bearerHeader);
      const payload = jwt.verify(token, config.suJwtSecret) as AuthPayload & UserPayload;
      req.user = payload;
      // req.user.ability = defineAbilitiesFor(payload.permissions);
      next();
    } catch (error) {
      console.log(error);
      logger.error("AuthenticationError:", error);
      next(error);
    }
  };
  static hasProjectAccess = () => {};

  static verifyRealmAccess = (allowedRealm: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        // Bypass middleware if request path matches any in whitelist
        if (shouldBypassAuth(req.path)) {
          return next();
        }
        const authHeader = req.headers["authorization"];
        if (!authHeader) throw new NotAuthenticated("Missing Authorization header");

        const token = authHeader.split(" ")[1];
        if (!token) throw new NotAuthenticated("Malformed Authorization header");

        const decoded = jwt.decode(token) as JwtPayload;
        if (!decoded || !decoded.iss) throw new NotAuthenticated("Token missing issuer");

        const issuer: string = decoded.iss;
        const realm = issuer.split("/").pop();

        if (realm !== allowedRealm) {
          throw new NotAuthorizedError();
        }

        return next();
      } catch (error) {
        logger.error("Realm Access Control Error", error);
        next(error);
      }
    };
  };
  static verifySupportRealmToken = async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const bearerHeader = req.headers["authorization"];
      const token = AuthGuard.extractToken(bearerHeader);
      const decodedToken = jwt.decode(token, { complete: true }) as JwtPayload | null;
      if (!decodedToken || !decodedToken.header || !decodedToken.header?.kid) throw new NotAuthenticated("Invalid token");
      if (!decodedToken.payload?.sub) throw new NotAuthenticated("Invalid token");
      const key = await jwksSupportClient.getSigningKey(decodedToken.header.kid);
      const signinKey = key.getPublicKey();
      try {
        const payload = jwt.verify(token, signinKey, { algorithms: ["RS256"] }) as AuthPayload & UserPayload;
        req.user = payload;
        req.user.id = payload.sub;
        return next();
      } catch (error) {
        logger.error("Token verification failed", error);
        throw new NotAuthenticated("Token verification failed");
      }
    } catch (error) {
      logger.error("Token verification failed", error);
      next(error);
    }
  };
}

export const stmClientHasAccess = AuthGuard.isClientAllowed(["s2m_client_app"]);

export default AuthGuard;

/**
 * 
 *
  azp: 's2m_client_app',
  sid: '2bbd5b09-d793-4ce0-9ac4-35a03fe91119',
  acr: '0',
  'allowed-origins': [ 'http://localhost:5173' ],
  realm_access: {
    roles: [ 'default-roles-s2m-app', 'offline_access', 'uma_authorization' ]
  },
  resource_access: { account: { roles: [Array] } },
  scope: 'openid permissions profile subscription_id email project_id',
  email_verified: false,
  permissions: '3',
  name: 'John Doe',
  subscription: '5e1e0d25-b4b9-4d98-b4b2-cfc798ec2571',
  preferred_username: 'john_doe',
  given_name: 'John',
  family_name: 'Doe',
  email: 'john.doe@example.com',
  id: 'ff96d321-c29c-458d-863e-1ed2c5ae7357'
}
 */
