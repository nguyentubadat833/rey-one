import { AppError } from '@/utils/errors/app.error';
import { ChangeSetType, defineEntity, EventArgs } from '@mikro-orm/core';
import { APP_PERMISSIONS, AppPermission } from '@rey-one/shared';
import { DomainRole } from './iam-domain-role.entity';
import { DomainMember } from './iam-domain-member.entity';
import { DomainRepository } from '../repositories/domain-repository';
import { Product } from './catalog-product.entity';
import { InvalidDomainStatusError } from '@/utils/errors/domain.error';
import { uuidv7 } from 'uuidv7';
import { BaseEntitySchema } from './base.entity';
import { Order } from './commerce-order.entity';
import { Party } from './iam-party.entity';
import randomstring from 'randomstring';

const BaseDomainSchema = defineEntity({
  name: 'IAMBaseDomain',
  abstract: true,
  extends: BaseEntitySchema,
  properties: (p) => ({
    active: p.boolean().default(true),
    permissions: p.enum(APP_PERMISSIONS).array().default([]),
  }),
});

const DomainEntitySchema = defineEntity({
  name: 'IAMDomain',
  tableName: 'iam_domain',
  repository: () => DomainRepository,
  extends: BaseDomainSchema,
  properties: (p) => ({
    id: p.uuid().primary().onCreate(uuidv7),
    party: () => p.oneToOne(Party).unique().ref(),
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
        .ref(),
    orders: () =>
      p
        .oneToMany(Order)
        .mappedBy((order) => order.domain)
        .orphanRemoval()
        .ref(),
  }),
});

export class BaseDomain extends BaseDomainSchema.class {}
BaseDomainSchema.setClass(BaseDomain);

export class Domain extends DomainEntitySchema.class {
  static ensureStatusValue(active: boolean) {
    if (!active) {
      throw InvalidDomainStatusError();
    }
  }

  static ensureStatus(domain: Domain) {
    if (!domain.active) {
      throw InvalidDomainStatusError();
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
  const changeSet = args.changeSet;
  const changeSetType: ChangeSetType | undefined = changeSet?.type;

  if (!changeSetType) return;

  const entity = args.entity;
  const changeSetPayload = changeSet?.payload;

  if (changeSetPayload?.permissions) {
    const permissions = args.entity.permissions;
    entity.permissions = Array.from(new Set(permissions));

    const roles = await entity.roles.loadItems();
    roles.forEach((role) => {
      role.permissions = role.permissions.filter((permission) => entity.permissions.includes(permission));
    });
  }

  if(changeSetType === ChangeSetType.CREATE){
    entity.party.getEntity().code = generatePartyCode()
  }
}

function generatePartyCode() {
  const string = randomstring.generate({
    length: 12,
    charset: '123456789QWERTYUPASDFGHJKLMNBVCXZ',
  });
  return `DOM${string}`;
}
