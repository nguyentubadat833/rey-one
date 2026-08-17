// export enum TenantRequirement {
//   REQUIRED = 'required',
//   SKIP = 'skip',
// }

export const AUTH_METADATA = {
  USER: 'user',
  IS_PUBLIC: 'is_public',
  REQUIRE_DOMAIN_PERMISSION: 'require_domain_permission',
  REQUIRE_SYSTEM_PERMISSION: 'require_system_permission'
} as const;

export const SERVICE_TOKENS = {
  SEPAY_CLIENT: Symbol("SEPAY_CLIENT"),
  DOAMIN_SERVICE: Symbol('DOMAIN_SERVICE'),
} as const;
