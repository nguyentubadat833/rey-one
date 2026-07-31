import { defineEntity, p } from '@mikro-orm/core';
import { Domain } from './iam-domain.entity';
import { User } from './iam-user.entity';
import { DomainRole } from './iam-domain-role.entity';
import { tenantFilterConfig } from './configs/doamin-tenant.filter';
import { BaseEntitySchema } from './base.entity';

const DomainMemberEntitySchema = defineEntity({
  name: 'IAMDomainMember',
  tableName: 'iam_domain_member',
  filters: tenantFilterConfig,
  extends: BaseEntitySchema,
  properties: {
    id: p.bigint().primary().autoincrement(),
    domain: () => p.manyToOne(Domain).ref(),
    user: () => p.manyToOne(User).ref(),
    role: () => p.manyToOne(DomainRole).eager().nullable().deleteRule('set null'),
  },
});

export class DomainMember extends DomainMemberEntitySchema.class {}

DomainMemberEntitySchema.setClass(DomainMember);
