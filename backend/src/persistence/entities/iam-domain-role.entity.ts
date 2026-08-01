import { AppError } from '@/utils/errors/app.error';
import { ChangeSetType, defineEntity, EventArgs, p } from '@mikro-orm/core';
import { APP_PERMISSIONS } from '@rey-one/shared';
import { Domain } from './iam-domain.entity';
import { DomainMember } from './iam-domain-member.entity';
import { tenantFilterConfig } from './configs/doamin-tenant.filter';
import { BaseEntitySchema } from './base.entity';
import slugify from 'slugify';
import randomstring from 'randomstring'

export const DomainRoleEntitySchema = defineEntity({
  name: 'IAMUserRole',
  tableName: 'iam_domain_role',
  filters: tenantFilterConfig,
  extends: BaseEntitySchema,
  properties: {
    id: p
      .string()
      .length(20)
      .primary()
      .onCreate((role) => generateId(role.name)),
    domain: () => p.manyToOne(Domain).ref(),
    members: () =>
      p
        .oneToMany(DomainMember)
        .mappedBy((member) => member.role)
        .ref(),
    name: p.string(),
    active: p.boolean().default(true),
    permissions: p.enum(APP_PERMISSIONS).array().default([]),
  },
});

export class DomainRole extends DomainRoleEntitySchema.class { }

DomainRoleEntitySchema.setClass(DomainRole);
DomainRoleEntitySchema.addHook('beforeCreate', handlerSave);
DomainRoleEntitySchema.addHook('beforeUpdate', handlerSave);

export function generateId(name: string) {
  const slug = slugify(name.slice(0, 7), {
    lower: true,
    strict: true,
    locale: 'vi',
    trim: true,
  });

  const suffix = randomstring.generate({
    length: 7,
    charset: 'alphabetic'
  });
  return `${slug}-${suffix}`.toUpperCase();
}

async function handlerSave(args: EventArgs<DomainRole>) {
  const changeSetType: ChangeSetType | undefined = args.changeSet?.type;

  if (!changeSetType) return;

  if (changeSetType === ChangeSetType.UPDATE && args.changeSet?.payload.domain) {
    throw AppError.withMessage('PROPERTY_IMMUTABLE', 'Domain is immutable');
  }

  if (args.changeSet?.payload.permissions) {
    const permissions = args.entity.permissions;

    const domain = await args.entity.domain.loadOrFail();
    args.entity.permissions = Array.from(new Set(permissions));
    domain.ensurePermissionsValid(args.entity.permissions);
  }
}
