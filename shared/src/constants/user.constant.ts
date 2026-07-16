export const LOCAL_PROVIDER = "local" as const;
export const OAUTH_PROVIDERS = ["google", "facebook"] as const;
export const USER_PROVIDERS = [...OAUTH_PROVIDERS, LOCAL_PROVIDER] as const;
export const USER_STATUSES = [
  "active",
  "banned",
  "deleted",
  "inactive",
  "pending",
] as const;

export const SYSTEM_SUPER_ADMIN_ROLE: string = "system_super_admin" as const;
export const SYSTEM_SUPPORT_ROLE: string = "system_support" as const;
export const ORG_ROLE: string = "org_user" as const;

export const USER_ROLES = [
  SYSTEM_SUPER_ADMIN_ROLE,
  SYSTEM_SUPPORT_ROLE,
  ORG_ROLE,
] as const;

export const USER_ROLES_ASSIGNABLE = [SYSTEM_SUPPORT_ROLE, ORG_ROLE];
