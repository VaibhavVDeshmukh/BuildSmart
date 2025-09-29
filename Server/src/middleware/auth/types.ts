import { PureAbility } from "@casl/ability";
import { Request } from "express";
export type AuthService =
  | "SUBSCRIPTION"
  | "BILLING"
  | "ALL_PROJECT"
  | "PROJECT"
  | "ALL_ZONE"
  | "ZONE"
  | "ALL_LAYER"
  | "LAYER"
  | "SCANS"
  | "SUBSCRIPTION_USER"
  | "PROJECT_USER"
  | "AUDIT"
  | "SETTINGS"
  | "ROLES"
  | "ANNOTATION"
  | "FEATURE"
  | "PROJECT_OWNER"
  | "USER_GROUP"
  | "PLUGINS";

export type AppAbility = PureAbility<[ResourceAction, AuthService]>;

export type AuthPayload = {
  projectAbility?: PureAbility;
  ability?: AppAbility;
  id: string;
  email: string;
  name: string;
  roles: string[];
  username: string;
  subscription?: string;
  permissions: string;
  project?: string;
  clientName: ResourceClient;
  sub: string;
  pp: string; // permission for project context
};

export type UserPayload = {
  sub: string;
  ability?: AppAbility;
  projectAbility?: AppAbility;
  // subscriptionId?: string;
};

export type AuthRequest = Request & { user: AuthPayload & UserPayload };

export type ResourceClient = "s2m_client_app" | "shp_app" | "autodetect_app" | "line_extract_app" | "point_extract_app" | "s2m_server" | "gis_app" | "bridge_app";

export const ResourceAction = {
  READ: "READ",
  WRITE: "WRITE",
  MANAGE: "MANAGE",
} as const;

export type ResourceAction = keyof typeof ResourceAction;
