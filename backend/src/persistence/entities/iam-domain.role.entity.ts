import { AppError } from '@/utils/errors/app.error';
import { ChangeSetType, defineEntity, EventArgs, p } from '@mikro-orm/core';
import { APP_PERMISSIONS } from '@rey-one/shared';
import { Domain } from './iam-domain.entity';
import { DomainMember } from './iam-domain.member.entity';
import slugify from 'slugify';
import { tenantDomainFilterConfig } from './configs/doamin-tenant.filter';

export const DomainRoleEntitySchema = defineEntity({
  name: 'IAMUserRole',
  tableName: 'iam_domain_role',
  // filters: tenantDomainFilterConfig,
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

export class DomainRole extends DomainRoleEntitySchema.class {}

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

  const suffix = crypto.randomUUID().slice(0, 7);
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
