import { defineEntity, InferEntity, raw } from '@mikro-orm/core';
import { BaseDomain, Domain } from '../entities/iam-domain.entity';

export const DomainSummary = defineEntity({
  name: 'IAMDomainSummary',
  extends: BaseDomain,
  expression: (em) =>
    em
      .createQueryBuilder(Domain, 'd')
      .select(['d.*', raw('count(distinct r.id) as "roleCount"'), raw('count(distinct m.id) as "memberCount"'), raw('count(distinct p.id) as "productCount"')])
      .leftJoin('d.roles', 'r')
      .leftJoin('d.members', 'm')
      .leftJoin('d.products', 'p')
      .groupBy('d.id'),
  properties: (p) => ({
    id: p.uuid(),
    roleCount: p.integer(),
    memberCount: p.integer(),
    productCount: p.integer(),
  }),
});

export type IDomainSummary = InferEntity<typeof DomainSummary>;