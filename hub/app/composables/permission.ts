import type { DomainPermission, SystemPermission } from "@rey-one/shared";

export type Permission = SystemPermission | DomainPermission;

export type PermissionCheck = {
  name: Permission;
  active: boolean;
};

export default function usePermissions() {
  function createPermissionsChecks(input: {
    currentPermissions?: Permission[];
    referencePermissions?: Permission[];
  }): PermissionCheck[] {
    if (input.referencePermissions) {
      return input.referencePermissions.map((pms) => ({
        name: pms,
        active: input.currentPermissions?.includes(pms) ?? false,
      }));
    } else {
      return (
        input.currentPermissions?.map((pms) => ({
          name: pms,
          active: true,
        })) ?? []
      );
    }
  }

  return {
    createPermissionsChecks,
  };
}
