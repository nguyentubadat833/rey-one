import { defineEntity } from '@mikro-orm/core';
import { Domain } from 'domain';
import { uuidv7 } from 'uuidv7';
import { Order } from './order.entity';
import { tenantFilterConfig } from './configs/doamin-tenant.filter';
import randomstring from 'randomstring';
import { User } from './user.entity';

const CustomerInfoSchema = defineEntity({
  name: 'CustomerInfo',
  embeddable: true,
  properties: (p) => ({
    name: p.string(),
    image: p.string().nullable(),
  }),
});

const CustomerEntitySchema = defineEntity({
  name: 'CustomerEntity',
  tableName: 'customer',
  filters: tenantFilterConfig,
  properties: (p) => ({
    id: p.uuid().primary().onCreate(uuidv7),
    code: p.string().length(15).unique().onCreate(generateCode),
    info: p.embedded(CustomerInfoSchema).lazy(),

    user: () => p.oneToOne(User).owner().nullable(),
    domain: () => p.manyToOne(Domain).eager(),
    orders: () => p.oneToMany(Order).mappedBy(order => order.customer)
  }),
});

export class Customer extends CustomerEntitySchema.class {}
CustomerEntitySchema.setClass(Customer);

function generateCode() {
  const code = randomstring.generate({
    length: 12,
    charset: '23456789QWERTYUPASDFGHJKLMNBVCXZ',
  });

  return `CSM${code}`;
}
