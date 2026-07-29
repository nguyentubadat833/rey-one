import { defineEntity, p } from '@mikro-orm/core';
import { User } from './iam-user.entity';
import { uuidv7 } from 'uuidv7';

const PartyEntitySchema = defineEntity({
  name: 'IAMParty',
  tableName: 'iam_party',
  properties: {
    id: p.uuid().primary().onCreate(uuidv7),
    name: p.string(),
    taxCode: p.string().unique().nullable(),
    user: () => p.oneToOne(User).nullable(),
  },
});

export class Party extends PartyEntitySchema.class {}
PartyEntitySchema.setClass(Party);
