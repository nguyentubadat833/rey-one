import { ArrayType, defineEntity, p } from '@mikro-orm/core';
import { AppPermission } from '@rey-one/shared';
import { Organization } from './iam.organization-entity';
import { OrganizationMembership } from './iam.organization-membership-entity';
import { AppError } from '@/utils/errors/app.error';

const OrganizationRoleEntitySchema = defineEntity({
  name: 'IAMV2OrganizationRole',
  tableName: 'iam_v2_organization_role',
  properties: {
    id: p.uuid().primary().defaultRaw('gen_random_uuid()'),
    name: p.string().length(255),
    enabled: p.boolean().default(false),
    permissions: p
      .type(ArrayType<AppPermission>)
      .default([])
      .fieldName('permissions'),
    organization: () => p.manyToOne(Organization).inversedBy((org) => org.roles),
    members: () => p.oneToMany(OrganizationMembership).mappedBy((member) => member.role),
  },
  uniques: [
    {
      properties: ['organization', 'name'],
    },
  ],
});

export class OrganizationRole extends OrganizationRoleEntitySchema.class {
  static ensureExists(role: OrganizationRole | null): asserts role is OrganizationRole {
    if (!role) {
      throw new AppError('ORGANIZATION_ROLE_NOT_FOUND');
    }
  }
}

OrganizationRoleEntitySchema.setClass(OrganizationRole);
