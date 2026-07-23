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

export const USER_ADMIN_TYPE = "admin_user" as const;
export const USER_NORMAL_TYPE = "user" as const;
export const USER_DOMAIN_TYPE = "domain_user" as const;
export const USER_TYPES = [
  USER_ADMIN_TYPE,
  USER_NORMAL_TYPE,
  USER_DOMAIN_TYPE,
] as const;
