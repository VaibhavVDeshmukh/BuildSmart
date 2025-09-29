import AuthGuard from "./auth.guard";

export const AccountUserGuard = {
  read: AuthGuard.checkAbility("SUBSCRIPTION_USER", ["READ"]),
  write: AuthGuard.checkAbility("SUBSCRIPTION_USER", ["WRITE"]),
  manage: AuthGuard.checkAbility("SUBSCRIPTION_USER", ["MANAGE"]),
};

export const AccountGuard = {
  read: AuthGuard.checkAbility("SUBSCRIPTION", ["READ"]),
  write: AuthGuard.checkAbility("SUBSCRIPTION", ["WRITE"]),
  manage: AuthGuard.checkAbility("SUBSCRIPTION", ["MANAGE"]),
};
export const SubscriptionUserGuard = {
  read: AuthGuard.checkAbility("SUBSCRIPTION_USER", ["READ"]),
  write: AuthGuard.checkAbility("SUBSCRIPTION_USER", ["WRITE"]),
  manage: AuthGuard.checkAbility("SUBSCRIPTION_USER", ["MANAGE"]),
};

export const UserGroupGuard = {
  read: AuthGuard.checkAbility("USER_GROUP", ["READ"]),
  write: AuthGuard.checkAbility("USER_GROUP", ["WRITE"]),
  manage: AuthGuard.checkAbility("USER_GROUP", ["MANAGE"]),
};

export const ProjectGuard = {
  read: AuthGuard.checkAbility("PROJECT", ["READ"]),
  write: AuthGuard.checkAbility("PROJECT", ["WRITE"]),
  manage: AuthGuard.checkAbility("PROJECT", ["MANAGE"]),
};

export const ZoneGuard = {
  read: AuthGuard.checkAbility("ZONE", ["READ"]),
  write: AuthGuard.checkAbility("ZONE", ["WRITE"]),
  manage: AuthGuard.checkAbility("ZONE", ["MANAGE"]),
  readAll: AuthGuard.checkAbility("ALL_ZONE", ["READ"]),
  writeAll: AuthGuard.checkAbility("ALL_ZONE", ["WRITE"]),
  manageAll: AuthGuard.checkAbility("ALL_ZONE", ["MANAGE"]),
};

export const LayerGuard = {
  read: AuthGuard.checkAbility("LAYER", ["READ"]),
  write: AuthGuard.checkAbility("LAYER", ["WRITE"]),
  manage: AuthGuard.checkAbility("LAYER", ["MANAGE"]),
};

export const FeatureGuard = {
  read: AuthGuard.checkAbility("FEATURE", ["READ"]),
  write: AuthGuard.checkAbility("FEATURE", ["WRITE"]),
  manage: AuthGuard.checkAbility("FEATURE", ["MANAGE"]),
};

export const ProjectSettingGuard = {
  read: AuthGuard.checkAbility("SETTINGS", ["READ"]),
  write: AuthGuard.checkAbility("SETTINGS", ["WRITE"]),
  manage: AuthGuard.checkAbility("SETTINGS", ["MANAGE"]),
};

export const ScanGuard = {
  read: AuthGuard.checkAbility("SCANS", ["READ"]),
  write: AuthGuard.checkAbility("SCANS", ["WRITE"]),
  manage: AuthGuard.checkAbility("SCANS", ["MANAGE"]),
};

export const AnnotationGuard = {
  read: AuthGuard.checkAbility("ANNOTATION", ["READ"], "Project"),
  write: AuthGuard.checkAbility("ANNOTATION", ["WRITE"], "Project"),
  manage: AuthGuard.checkAbility("ANNOTATION", ["MANAGE"], "Project"),
};

export const ProjectOwnerGuard = {
  read: AuthGuard.checkAbility("PROJECT_OWNER", ["READ"]),
  write: AuthGuard.checkAbility("PROJECT_OWNER", ["WRITE"]),
  manage: AuthGuard.checkAbility("PROJECT_OWNER", ["MANAGE"]),
};
