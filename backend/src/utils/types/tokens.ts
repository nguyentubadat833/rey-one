export enum TenantRequirement {
  REQUIRED = 'required',
  SKIP = 'skip',
}

export const AUTH_METADATA = {
  USER: 'user',
  IS_PUBLIC: 'is_public',
  REQUIRE_PERMISSION: 'require_permission',
  REQUIRE_TENANT: TenantRequirement,
} as const;

export const SERVICE_TOKENS = {
  DOAMIN_SERVICE: Symbol('DOMAIN_SERVICE'),
} as const;
