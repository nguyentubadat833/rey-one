import { defineEntity, InferEntity, raw } from '@mikro-orm/core';
import { BaseDomain, Domain } from '../domain.entity';

export const DomainSummary = defineEntity({
  name: 'IAMDomainSummary',
  extends: BaseDomain,
  expression: (em) =>
    em
      .createQueryBuilder(Domain, 'd')
      .select([
        'd.*',
        'pt.name as name',
        raw('count(distinct r.id) as "roleCount"'),
        raw('count(distinct m.id) as "memberCount"'),
        raw('count(distinct p.id) as "productCount"'),
      ])
      .leftJoin('d.roles', 'r')
      .leftJoin('d.members', 'm')
      .leftJoin('d.products', 'p')
      .leftJoin('d.party', 'pt')
      .groupBy(['d.id', 'pt.name']),
  properties: (p) => ({
    id: p.uuid(),
    name: p.string(),
    roleCount: p.integer(),
    memberCount: p.integer(),
    productCount: p.integer(),
  }),
});

export type IDomainSummary = InferEntity<typeof DomainSummary>;
