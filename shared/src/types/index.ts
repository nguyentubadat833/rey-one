import {
  USER_ROLES,
  USER_STATUSES,
  OAUTH_PROVIDERS,
  USER_PROVIDERS,
  ORGANIZATION_STATUSES,
  ORGANIZATION_TYPES,
  APP_PERMISSIONS,
  APP_PERMISSION_GROUPS,
  CURRENCIES,
} from "../constants";

export type Currency = (typeof CURRENCIES)[number];

export type AppPermission = (typeof APP_PERMISSIONS)[number];
export type AppPermissionGroup = (typeof APP_PERMISSION_GROUPS)[number];

export type UserProvider = (typeof USER_PROVIDERS)[number];
export type UserRole = (typeof USER_ROLES)[number];
export type UserStatus = (typeof USER_STATUSES)[number];
export type OAuthProvider = (typeof OAUTH_PROVIDERS)[number];

export type OrganizationStatus = (typeof ORGANIZATION_STATUSES)[number];
export type OrganizationType = (typeof ORGANIZATION_TYPES)[number];