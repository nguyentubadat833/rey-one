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

// export function propertyNullToUndefined<T>(
//   value: T | null | undefined,
// ): Exclude<T, null> | undefined {
//   return value === null
//     ? undefined
//     : value as Exclude<T, null> | undefined
// }

// export function permissionsToChecks(permissions: AppPermission[], defaultActive?: boolean) {
//   return permissions.map((name) => ({
//     permission: name,
//     active: defaultActive ?? false,
//   }));
// }