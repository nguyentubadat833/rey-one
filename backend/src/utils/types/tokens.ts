// export enum TenantRequirement {
//   REQUIRED = 'required',
//   SKIP = 'skip',
// }

export const AUTH_METADATA = {
  USER: 'user',
  IS_PUBLIC: 'is_public',
  IS_FORCE_DOMAIN_ACTIVE: 'is_force_domain_active',
  REQUIRE_DOMAIN_PERMISSION: 'require_domain_permission',
  REQUIRE_SYSTEM_PERMISSION: 'require_system_permission'
} as const;

export const TOKENS = {
  SEPAY_CLIENT: Symbol("SEPAY_CLIENT"),
  AUTH_UTILS: Symbol('AUTH_UTILS'),
  DOMAIN_UTILS: Symbol('DOMAIN_UTILS'),
} as const;
