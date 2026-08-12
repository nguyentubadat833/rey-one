import { defineEntity, p } from '@mikro-orm/core';
import { uuidv7 } from 'uuidv7';
import { BaseEntitySchema } from './base.entity';
import { Order } from './commerce-order.entity';
import { User } from './iam-user.entity';
import { Domain } from './iam-domain.entity';
import randomstring from 'randomstring';

const PartyEntitySchema = defineEntity({
  name: 'IAMParty',
  tableName: 'iam_party',
  extends: BaseEntitySchema,
  properties: {
    id: p.uuid().primary().onCreate(uuidv7),
    code: p.string().length(15).unique(),
    name: p.string(),
    taxCode: p.string().unique().nullable().fieldName('tax_code'),
    user: () =>
      p
        .oneToOne(User)
        .mappedBy((user) => user.party)
        .nullable(),
    domain: () =>
      p
        .oneToOne(Domain)
        .mappedBy((domain) => domain.party)
        .nullable(),
    orders: () => p.oneToMany(Order).mappedBy((order) => order.customer),
    // customerDomain: () =>
    //   p.manyToOne(Domain)
    //     .fieldName('customer_domain_id')
    //     .nullable(),
  },
});

export class Party extends PartyEntitySchema.class {
  static partyPrefix = 'PAT' as const;

  static generatePartyCode() {
    const code = randomstring.generate({
      length: 12,
      charset: '123456789QWERTYUPASDFGHJKLMNBVCXZ',
    });
    return `${Party.partyPrefix}${code}`;
  }
}
PartyEntitySchema.setClass(Party);
PartyEntitySchema.addHook('beforeCreate', (args) => {
  // const entity = args.entity
  // if(!entity.code){
  //   entity.code = generatePartyCode()
  // }
});
