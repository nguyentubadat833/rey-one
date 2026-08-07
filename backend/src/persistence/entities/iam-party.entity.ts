import { defineEntity, p } from '@mikro-orm/core';
import { uuidv7 } from 'uuidv7';
import { BaseEntitySchema } from './base.entity';
import { Order } from './commerce-order.entity';
import randomstring from 'randomstring'

const PartyEntitySchema = defineEntity({
  name: 'IAMParty',
  tableName: 'iam_party',
  extends: BaseEntitySchema,
  properties: {
    id: p.uuid().primary().onCreate(uuidv7),
    code: p.string().length(15).unique().onCreate(generatePartyCode),
    name: p.string(),
    taxCode: p.string().unique().nullable().fieldName('tax_code'),
    orders: () => p.oneToMany(Order).mappedBy((order) => order.customer),
  },
});

export class Party extends PartyEntitySchema.class {}
PartyEntitySchema.setClass(Party);
PartyEntitySchema.addHook('beforeCreate', (args) => {
  const entity = args.entity
  if(!entity.code){
    entity.code = generatePartyCode()
  }
})

function generatePartyCode(){
  return randomstring.generate({
    length: 15,
    charset: '123456789QWERTYUPASDFGHJKLMNBVCXZ'
  })
}
