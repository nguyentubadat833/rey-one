import { AppError } from '@/utils/errors/app.error';
import { ChangeSetType, defineEntity, EventArgs } from '@mikro-orm/core';
import { DomainStatus, DOMAIN_PERMISSIONS, DomainPermission } from '@rey-one/shared';
import { uuidv7 } from 'uuidv7';
import { BaseEntitySchema } from './base.entity';
import { Subscription } from './subscription.entity';
import { InvalidDomainStatusError } from '@/utils/errors/domain.error';
import { Order } from './order.entity';
import { Role } from './role.entity';
import randomstring from 'randomstring';

const DomainEntitySchema = defineEntity({
  name: 'DomainEntity',
  tableName: 'domain',
  extends: BaseEntitySchema,
  properties: (p) => ({
    id: p.uuid().primary().onCreate(uuidv7),
    name: p.string(),
    image: p.string().nullable(),
    code: p.string().length(15).unique().onCreate(generateCode),
    active: p.boolean().persist(false),
    permissions: p.enum(DOMAIN_PERMISSIONS).array().default([]),

    // info: () => p.oneToOne(DomainInfoEntitySchema).mappedBy((info) => info.domain),
    subscription: () => p.oneToOne(Subscription).owner().eager(),
    roles: () => p.oneToMany(Role).mappedBy((role) => role.domain),

    // products: () =>
    //   p
    //     .oneToMany(Product)
    //     .mappedBy((product) => product.domain)
    //     .orphanRemoval()
    //     .ref(),
    orders: () =>
      p
        .oneToMany(Order)
        .mappedBy((order) => order.domain)
        .orphanRemoval()
        .ref(),
  }),
});

export class Domain extends DomainEntitySchema.class {
  ensurePermissionsValid(permissions: DomainPermission[]) {
    const invalid = permissions.filter((p) => !this.permissions.includes(p));
    if (invalid.length > 0) {
      throw new AppError('INVALID_VALUE', `Permissions not available in domain: ${invalid.join(', ')}`);
    }
  }

  ensureActive() {
    if (!this.active) {
      throw InvalidDomainStatusError();
    }
  }

  getStatus(): DomainStatus {
    if (!this.subscription) return 'pending';

    const subscription = this.subscription;
    if (subscription.expiresAt && subscription.expiresAt < new Date()) {
      return 'expiring';
    }

    return 'active';
  }
}

DomainEntitySchema.setClass(Domain);
DomainEntitySchema.addHook('beforeCreate', saveHandler);
DomainEntitySchema.addHook('beforeUpdate', saveHandler);
DomainEntitySchema.addHook('onInit', initHandler);

async function initHandler(args: EventArgs<Domain>) {
  const entity = args.entity;
  const sub = entity.subscription;

  entity.active = !!sub && (!sub.expiresAt || sub.expiresAt > new Date());
}

async function saveHandler(args: EventArgs<Domain>) {
  const changeSet = args.changeSet;
  const changeSetType: ChangeSetType | undefined = changeSet?.type;

  if (!changeSetType) return;

  const entity = args.entity;
  const changeSetPayload = changeSet?.payload;

  if (changeSetPayload?.permissions) {
    const permissions = args.entity.permissions;
    entity.permissions = Array.from(new Set(permissions));
  }
}

function generateCode() {
  const code = randomstring.generate({
    length: 12,
    charset: '23456789QWERTYUPASDFGHKLMNBVCXZ',
  });

  return `DAM${code}`;
}
