import AuthGuard from "./auth.guard";

export const FileGuard = {
  read: AuthGuard.checkAbility("SCANS", ["READ"]),
  writeWithProjectId: AuthGuard.checkAbility("SCANS", ["WRITE"], "Project"),
  write: AuthGuard.checkAbility("SCANS", ["WRITE"]),
  manage: AuthGuard.checkAbility("SCANS", ["MANAGE"]),
};
export const FileUploadGuard = AuthGuard.isClientAllowed(["bridge_app"]);
