import { ChangeSetType, defineEntity, EventArgs } from '@mikro-orm/core';
import { Domain } from './domain.entity';
import { Plan } from './plan.entity';
import { AppError } from '@/utils/errors/app.error';

const DomainSubscriptionEntitySchema = defineEntity({
  name: 'DomainSubscriptionEntity',
  tableName: 'domain_supscription',
  properties: (p) => ({
    id: p.integer().primary().autoincrement(),
    startedAt: p.datetime().fieldName('started_at'),
    expiresAt: p.datetime().nullable().fieldName('expires_at'),
    domain: () => p.oneToOne(Domain).mappedBy((domain) => domain.subscription),
    plan: () => p.manyToOne(Plan),
  }),
});

export class DomainSubscription extends DomainSubscriptionEntitySchema.class {}
DomainSubscriptionEntitySchema.setClass(DomainSubscription);