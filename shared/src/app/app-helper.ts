// import { AppPermission } from "./app-type";

// const PERMISSION_HIERARCHY: Partial<Record<AppPermission, AppPermission[]>> = {
//   "module:domain:manage": [
//     "module:domain:red",
//     "domain:manage"
//   ],
//   "module:domain:red": [
//     "domain:manage:read"
//   ],
//   //
//   "domain:manage": [
//     "domain:manage:read",
//     //
//     "product:manage",
//     //
//     "order:manage"
//   ],
//   //
//   "domain:manage:read": [
//     "product:read",
//     "order:read",
//   ],
//   //
//   "product:manage": [
//     "product:read"
//   ],
//   //
//   "user:manage": [
//     "user:read"
//   ],
// };

// // Resolve tất cả permissions user thực sự có (bao gồm implied permissions)
// export function resolvePermissions(
//   permissions: AppPermission[],
// ): Set<AppPermission> {
//   const resolved = new Set<AppPermission>(permissions);

//   for (const [permission, implies] of Object.entries(PERMISSION_HIERARCHY)) {
//     if (resolved.has(permission as AppPermission)) {
//       implies.forEach((p) => resolved.add(p));
//     }
//   }

//   return resolved;
// }

// // Check 1 permission
// export function hasPermission(
//   userPermissions: AppPermission[],
//   required: AppPermission,
// ): boolean {
//   return resolvePermissions(userPermissions).has(required);
// }

// // Check nhiều permissions (AND)
// export function hasPermissions(
//   userPermissions: AppPermission[],
//   required: AppPermission[],
// ): boolean {
//   const resolved = resolvePermissions(userPermissions);
//   return required.every((p) => resolved.has(p));
// }
