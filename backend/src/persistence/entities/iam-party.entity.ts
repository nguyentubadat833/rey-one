import { defineEntity, p } from '@mikro-orm/core';
import { User } from './iam-user.entity';

const PartyEntitySchema = defineEntity({
  name: 'IAMParty',
  tableName: 'iam_party',
  properties: {
    id: p.uuid().primary().defaultRaw('gen_random_uuid()'),
    name: p.string(),
    taxCode: p.string().unique().nullable(),
    user: () => p.oneToOne(User).nullable(),
  },
});

export class Party extends PartyEntitySchema.class {}
PartyEntitySchema.setClass(Party);
