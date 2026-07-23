import { AppPermission } from "./app-type";

const DOMAIN_ROLE_ITEMS: AppPermission[] = [
  "domain:role:manage",
  "domain:role:read",
];

const DOMAIN_MEMBER_ITEMS: AppPermission[] = [
  "domain:member:manage",
  "domain:member:read",
];

const DOMAIN_MANAGER_ITEMS: AppPermission[] = [
  "domain:manage:read",
  ...DOMAIN_MEMBER_ITEMS,
  ...DOMAIN_ROLE_ITEMS,
];

const PERMISSION_HIERARCHY: Partial<Record<AppPermission, AppPermission[]>> = {
  "domain:role:manage": ["domain:role:read"],
  "domain:member:manage": ["domain:manage:read"],
  "domain:manage": DOMAIN_MANAGER_ITEMS,
};

// Resolve tất cả permissions user thực sự có (bao gồm implied permissions)
export function resolvePermissions(
  permissions: AppPermission[],
): Set<AppPermission> {
  const resolved = new Set<AppPermission>(permissions);

  for (const [permission, implies] of Object.entries(PERMISSION_HIERARCHY)) {
    if (resolved.has(permission as AppPermission)) {
      implies.forEach((p) => resolved.add(p));
    }
  }

  return resolved;
}

// Check 1 permission
export function hasPermission(
  userPermissions: AppPermission[],
  required: AppPermission,
): boolean {
  return resolvePermissions(userPermissions).has(required);
}

// Check nhiều permissions (AND)
export function hasPermissions(
  userPermissions: AppPermission[],
  required: AppPermission[],
): boolean {
  const resolved = resolvePermissions(userPermissions);
  return required.every((p) => resolved.has(p));
}
