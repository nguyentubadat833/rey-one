import { AppError } from '@/utils/errors/app.error';
import { ChangeSetType, defineEntity, EventArgs } from '@mikro-orm/core';
import { APP_PERMISSIONS, AppPermission } from '@rey-one/shared';
import { Role } from './role.entity';
import { DomainMember } from './domain-member.entity';
import { DomainRepository } from '../repositories/domain-repository';
import { Product } from './product.entity';
import { InvalidDomainStatusError } from '@/utils/errors/domain.error';
import { uuidv7 } from 'uuidv7';
import { BaseEntitySchema } from './base.entity';
import { Order } from './order.entity';
import randomstring from 'randomstring';
import { DomainSubscription } from './domain-subscription.entity';
import { Customer } from './customer.entity';

const DomainInfoSchema = defineEntity({
  name: 'DomainInfo',
  embeddable: true,
  properties: (p) => ({
    name: p.string(),
    image: p.string().nullable(),
  }),
});

const DomainEntitySchema = defineEntity({
  name: 'DomainEntity',
  tableName: 'domain',
  repository: () => DomainRepository,
  extends: BaseEntitySchema,
  properties: (p) => ({
    id: p.uuid().primary().onCreate(uuidv7),
    code: p.string().length(15).unique().onCreate(generateCode),
    // active: p.boolean().default(true),
    active: p.boolean().persist(false),
    permissions: p.enum(APP_PERMISSIONS).array().default([]),
    info: p.embedded(DomainInfoSchema).lazy(),
    subscription: () => p.oneToOne(DomainSubscription).owner().nullable().eager(),
    roles: () =>
      p
        .oneToMany(Role)
        .mappedBy((role) => role.domain)
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
    customers: () =>
      p
        .oneToMany(Customer)
        .mappedBy((customer) => customer.domain)
        .orphanRemoval()
        .ref()
  }),
});

// export class BaseDomain extends BaseDomainSchema.class {}
// BaseDomainSchema.setClass(BaseDomain);

export class Domain extends DomainEntitySchema.class {
  // static partyPrefix = 'DOM' as const;

  // static generatePartyCode() {
  //   const code = randomstring.generate({
  //     length: 12,
  //     charset: '123456789QWERTYUPASDFGHJKLMNBVCXZ',
  //   });
  //   return `${Domain.partyPrefix}${code}`;
  // }

  // static ensureStatusValue(active: boolean) {
  //   if (!active) {
  //     throw InvalidDomainStatusError();
  //   }
  // }

  // static ensureStatus(domain: Domain) {
  //   if (!domain.active) {
  //     throw InvalidDomainStatusError();
  //   }
  // }

  ensurePermissionsValid(permissions: AppPermission[]) {
    const invalid = permissions.filter((p) => !this.permissions.includes(p));
    if (invalid.length > 0) {
      throw new AppError('INVALID_PERMISSION', `Permissions not available in domain: ${invalid.join(', ')}`);
    }
  }

  ensureActive() {
    if (!this.subscription) throw AppError.withMessage('PROPERTY_REQUIRED', 'Domain subscription required');
    const subscription = this.subscription;

    this.active = !subscription.expiresAt || subscription.expiresAt > new Date();
  }

  // ensureStatus() {
  //   Domain.ensureStatus(this);
  // }
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

    // const roles = await entity.roles.loadItems();
    // roles.forEach((role) => {
    //   role.permissions = role.permissions.filter((permission) => entity.permissions.includes(permission));
    // });
  }

  // if (changeSetType === ChangeSetType.CREATE) {
  //   console.log('domain')
  //   entity.party.getEntity().code = generatePartyCode();
  // }
}

// function generatePartyCode() {
//   const string = randomstring.generate({
//     length: 12,
//     charset: '123456789QWERTYUPASDFGHJKLMNBVCXZ',
//   });
//   return `DOM${string}`;
// }

function generateCode() {
  const code = randomstring.generate({
    length: 12,
    charset: '23456789QWERTYUPASDFGHJKLMNBVCXZ',
  });

  return `DAM${code}`;
}
