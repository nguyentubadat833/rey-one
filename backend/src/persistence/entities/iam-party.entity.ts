import { defineEntity, p } from '@mikro-orm/core';
import { User } from './iam-user.entity';
import { uuidv7 } from 'uuidv7';
import { BaseEntitySchema } from './base.entity';
import { Order } from './commerce-order.entity';

const PartyEntitySchema = defineEntity({
  name: 'IAMParty',
  tableName: 'iam_party',
  extends: BaseEntitySchema,
  properties: {
    id: p.uuid().primary().onCreate(uuidv7),
    name: p.string(),
    taxCode: p.string().unique().nullable().fieldName('tax_code'),
    user: () => p.oneToOne(User).nullable(),
    orders: () => p.oneToMany(Order).mappedBy((order) => order.customer),
  },
});

export class Party extends PartyEntitySchema.class {}
PartyEntitySchema.setClass(Party);
