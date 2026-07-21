import {
  APP_PERMISSIONS,
  APP_PERMISSION_GROUPS,
  CURRENCIES,
} from "../constants";

export type Currency = (typeof CURRENCIES)[number];

export type AppPermission = (typeof APP_PERMISSIONS)[number];
export type AppPermissionGroup = (typeof APP_PERMISSION_GROUPS)[number];

export * from './iam'