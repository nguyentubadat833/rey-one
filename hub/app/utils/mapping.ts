import type { AppPermission } from "@rey-one/shared";

export function nullToUndefined<T extends Record<string, any>>(
  obj: T,
): {
  [K in keyof T]: Exclude<T[K], null> | undefined;
} {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key,
      value === null ? undefined : value,
    ]),
  ) as any;
}

export function permissionsToChecks(permissions: AppPermission[], defaultActive?: boolean) {
  return permissions.map((name) => ({
    permission: name,
    active: defaultActive ?? false,
  }));
}
