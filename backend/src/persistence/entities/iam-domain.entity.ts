import { AppError } from '@/utils/errors/app.error';
import { defineEntity, EventArgs, p } from '@mikro-orm/core';
import { APP_PERMISSIONS, AppPermission } from '@rey-one/shared';
import { DomainRole } from './iam-domain.role.entity';
import { DomainMember } from './iam-domain.member.entity';
import { DomainRepository } from '../repositories/domain-repository';
import { Product } from './catalog-product.entity';

const DomainEntitySchema = defineEntity({
  name: 'IAMDomain',
  tableName: 'iam_domain',
  repository: () => DomainRepository,
  properties: {
    id: p.uuid().primary().defaultRaw('gen_random_uuid()'),
    name: p.string().unique(),
    active: p.boolean().default(true),
    permissions: p.enum(APP_PERMISSIONS).array().default([]),
    roles: () =>
      p
        .oneToMany(DomainRole)
        .mappedBy((role) => role.domain)
        .orphanRemoval()
        .ref(),
    members: () =>
      p
        .oneToMany(DomainMember)
        .mappedBy((member) => member.domain)
        .orphanRemoval()
        .ref(),
    products: () =>
      p
        .oneToMany(Product)
        .mappedBy((product) => product.owner)
        .orphanRemoval()
        .ref(),
  },
});

export class Domain extends DomainEntitySchema.class {
  static ensureStatus(domain: Domain) {
    if (!domain.active) {
      throw AppError.withMessage('INVALID_STATUS', 'Invalid domain status');
    }
  }

  ensurePermissionsValid(permissions: AppPermission[]) {
    const invalid = permissions.filter((p) => !this.permissions.includes(p));
    if (invalid.length > 0) {
      throw new AppError('INVALID_PERMISSION', `Permissions not available in domain: ${invalid.join(', ')}`);
    }
  }

  ensureStatus() {
    Domain.ensureStatus(this);
  }
}

DomainEntitySchema.setClass(Domain);
DomainEntitySchema.addHook('beforeCreate', saveHandler);
DomainEntitySchema.addHook('beforeUpdate', saveHandler);

async function saveHandler(args: EventArgs<Domain>) {
  const changeSetPayload = args.changeSet?.payload;

  if (changeSetPayload?.permissions) {
    const permissions = args.entity.permissions;
    args.entity.permissions = Array.from(new Set(permissions));
  }
}
