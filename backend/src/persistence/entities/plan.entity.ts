import { defineEntity, p } from '@mikro-orm/core';
import { CURRENCIES, SUBSCRIPTION_PLANS } from '@rey-one/shared';
import { BaseEntitySchema } from './base.entity';

const PlanEntitySchema = defineEntity({
  name: 'PlanEntity',
  tableName: 'plan',
  extends: BaseEntitySchema,
  properties: {
    id: p.bigint().primary().autoincrement(),
    plan: p.enum(SUBSCRIPTION_PLANS),
    price: p.bigint(),
    currency: p.enum(CURRENCIES).default('VND'),
    active: p.boolean().default(true),
  },

  uniques: [
    {
      properties: ['plan'],
      where: { active: true },
    },
  ],
});

export class Plan extends PlanEntitySchema.class{}
PlanEntitySchema.setClass(Plan)

// export function generateCode(name: string) {
//   const slug = slugify(name.slice(0, 10), {
//     lower: true,
//     strict: true,
//     locale: 'vi',
//     trim: true,
//   });

//   const suffix = randomstring.generate({
//     length: 5,
//     charset: '23456789QWERTYUPASDFGHKLMNBVCXZ',
//   });
//   return `${slug}${suffix}`.toUpperCase();
// }
