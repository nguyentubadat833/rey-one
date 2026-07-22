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
export const USER_TYPES = [
  'system',
  'domain'
] as const