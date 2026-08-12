import { defineEntity } from '@mikro-orm/core';
import { Domain } from './domain.entity';
import { CURRENCIES, SUBSCRIPTION_PLANS } from '@rey-one/shared';

const SubscriptionEntitySchema = defineEntity({
  name: 'SubscriptionEntity',
  tableName: 'supscription',
  properties: (p) => ({
    id: p.integer().primary().autoincrement(),
    startedAt: p.datetime().fieldName('started_at'),
    expiresAt: p.datetime().nullable().fieldName('expires_at'),
    plan: p.enum(SUBSCRIPTION_PLANS),
    price: p.bigint(),
    currency: p.enum(CURRENCIES).default('VND'),
    
    domain: () => p.oneToOne(Domain).mappedBy((domain) => domain.subscription),
  }),
});

export class Subscription extends SubscriptionEntitySchema.class {}
SubscriptionEntitySchema.setClass(Subscription);