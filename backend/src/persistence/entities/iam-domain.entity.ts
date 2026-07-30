import { AppError } from '@/utils/errors/app.error';
import { defineEntity, EventArgs, p } from '@mikro-orm/core';
import { APP_PERMISSIONS, AppPermission } from '@rey-one/shared';
import { DomainRole } from './iam-domain-role.entity';
import { DomainMember } from './iam-domain-member.entity';
import { DomainRepository } from '../repositories/domain-repository';
import { Product } from './catalog-product.entity';
import { InvalidDomainStatus } from '@/utils/errors/domain.error';
import { uuidv7 } from 'uuidv7';

const BaseDomainSchema = defineEntity({
  name: 'IAMBaseDomain',
  abstract: true,
  properties: (p) => ({
    name: p.string().unique(),
    active: p.boolean().default(true),
    permissions: p.enum(APP_PERMISSIONS).array().default([]),
  }),
});

const DomainEntitySchema = defineEntity({
  name: 'IAMDomain',
  tableName: 'iam_domain',
  repository: () => DomainRepository,
  extends: BaseDomainSchema,
  properties: {
    id: p.uuid().primary().onCreate(uuidv7),
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
        .mappedBy((product) => product.domain)
        .orphanRemoval()
        .ref()
  },
});

export class BaseDomain extends BaseDomainSchema.class {}
BaseDomainSchema.setClass(BaseDomain);

export class Domain extends DomainEntitySchema.class {
  
  static ensureStatusValue(active: boolean) {
    if (!active) {
      throw InvalidDomainStatus();
    }
  }

  static ensureStatus(domain: Domain) {
    if (!domain.active) {
      throw InvalidDomainStatus();
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
