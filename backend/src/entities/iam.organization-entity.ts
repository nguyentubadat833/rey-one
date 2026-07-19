import { ArrayType, defineEntity, p } from '@mikro-orm/core';
import { ORGANIZATION_STATUSES, AppPermission, OrganizationStatus, AppPermissionGroup, CURRENCIES } from '@rey-one/shared';
import { AppError } from '@/utils/errors/app.error';
import { Party } from './iam.party-entity';
import { OrganizationRole } from './iam.organization-role-entity';
import { OrganizationMembership } from './iam.organization-membership-entity';
import { Product } from './product-entity';

const defaultStatus: OrganizationStatus = 'active';

const OrganizationEntitySchema = defineEntity({
  name: 'IAMOrganization',
  tableName: 'iam_organization',
  properties: {
    party: () => p.oneToOne(Party).owner().primary().joinColumn('id'),
    parent: () => p.manyToOne(Organization).joinColumn('parent_id').nullable().owner(),
    branches: () => p.oneToMany(Organization).mappedBy(o => o.parent),
    roles: () => p.oneToMany(OrganizationRole).mappedBy((r) => r.organization),
    members: () => p.oneToMany(OrganizationMembership).mappedBy(member => member.organization),
    products: () => p.oneToMany(Product).mappedBy(product => product.organization),
    currency: p.enum(() => CURRENCIES),
    status: p.enum(() => ORGANIZATION_STATUSES).default(defaultStatus),
    permissions: p
      .type(ArrayType<AppPermission>)
      .default([])
      .fieldName('permissions'),
    enabledMultipleBranch: p.boolean().default(false).fieldName('enabled_multiple_branch'),
  },
});

export class Organization extends OrganizationEntitySchema.class {
  static ensureExists(organization: Organization | null): asserts organization is Organization {
    if (!organization) {
      throw new AppError('ORGANIZATION_NOT_FOUND');
    }
  }

  static ensureActive(organization: Organization) {
    if (organization.status !== 'active') {
      throw new AppError('INVALID_ORGANIZATION_STATUS');
    }
  }

  static getModuleFromPermission(permission: AppPermission): AppPermissionGroup {
    return permission.split(':')[0] as AppPermissionGroup;
  }

  static getEnabledModules(permissions: AppPermission[]): AppPermissionGroup[] {
    return [...new Set(permissions.map(Organization.getModuleFromPermission))];
  }

  ensurePermissions(permissions: AppPermission[]) {
    const invalid = permissions.filter((p) => !this.permissions.includes(p));
    if (invalid.length > 0) {
      throw new AppError('ORGANIZATION_PERMISSION_NOT_FOUND', {
        organizationPermissions: this.permissions,
        inputPermissions: permissions,
        invalidPermissions: invalid,
      });
    }
  }

}

OrganizationEntitySchema.setClass(Organization);
