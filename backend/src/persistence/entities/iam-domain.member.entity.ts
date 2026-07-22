import { defineEntity, p } from '@mikro-orm/core';
import { Domain } from './iam-domain.entity';
import { User } from './iam-user.entity';
import { DomainRole } from './iam-domain.role.entity';

const DomainMemberEntitySchema = defineEntity({
  name: 'IAMDomainMember',
  tableName: 'iam_domain_member',
  properties: {
    id: p.bigint().primary().autoincrement(),
    domain: () => p.manyToOne(Domain).eager(),
    user: () => p.manyToOne(User).eager(),
    role: () => p.manyToOne(DomainRole).eager().nullable().deleteRule('set null'),
  },
});

export class DomainMember extends DomainMemberEntitySchema.class {}

DomainMemberEntitySchema.setClass(DomainMember);
