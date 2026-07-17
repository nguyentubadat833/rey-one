import { defineEntity, p } from '@mikro-orm/core';
import { Organization } from './iam.organization-entity';
import { User } from './iam.user-entity';
import { OrganizationRole } from './iam.organization-role-entity';
import { AppError } from '@/utils/errors/app.error';

const OrganizationMembershipEntitySchema = defineEntity({
  name: 'IAMV2OrganizationMembership',
  tableName: 'iam_v2_organization_membership',
  properties: {
    id: p.uuid().primary().defaultRaw('gen_random_uuid()'),
    organization: () =>
      p
        .manyToOne(Organization)
        .inversedBy((org) => org.members)
        .fieldName('organization_id'),
    user: () =>
      p
        .manyToOne(User)
        .inversedBy((user) => user.memberships)
        .fieldName('user_id'),
    role: () =>
      p
        .manyToOne(OrganizationRole)
        .inversedBy((role) => role.members)
        .fieldName('membership_role_id'),
  },
  uniques: [
    {
      properties: ['user', 'organization'],
    },
  ],
  // filters: {
  //   organization: {
  //     name: 'organization',
  //     cond: (args: { organizationId: string }) => ({ organization: args.organizationId }),
  //     default: true,
  //   },
  // },
});

export class OrganizationMembership extends OrganizationMembershipEntitySchema.class {
  static ensureExists(member: OrganizationMembership | null): asserts member is OrganizationMembership {
    if (!member) {
      throw new AppError('MEMBERSHIP_NOT_FOUND');
    }
  }
}

OrganizationMembershipEntitySchema.setClass(OrganizationMembership);
