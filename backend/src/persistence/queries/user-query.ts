import { defineEntity, InferEntity, raw } from '@mikro-orm/core';
import { User, BaseUserEntitySchema } from '../entities/iam-user.entity';
import { DomainMember } from '../entities/iam-domain.member.entity';

export const UserSummary = defineEntity({
  name: 'UserSummary',
  extends: BaseUserEntitySchema,
  expression: (em) =>
    em
      .createQueryBuilder(User, 'u')
      .select([
        raw('u.id'),
        raw('u.type'),
        raw('u.status'),
        raw('u.username'),
        raw('u.email'),
        raw('u.phone'),
        raw('p.name as name'),
        em
          .createQueryBuilder(DomainMember, 'm')
          .count('m.id')
          .where({ user: raw('u.id') })
          .as('memberCount'),
      ])
      .leftJoin('u.party', 'p'),
  properties: (p) => ({
    id: p.uuid(),
    name: p.string(),
    memberCount: p.integer(),
  }),
});

export type IUserSummary = InferEntity<typeof UserSummary>;