import { DOMAIN_PERMISSIONS, SYSTEM_PERMISSIONS } from "@rey-one/shared";

export const PERMISSIONS = [
    ...DOMAIN_PERMISSIONS,
    ...SYSTEM_PERMISSIONS
] as const

export type Permission = typeof PERMISSIONS[number]