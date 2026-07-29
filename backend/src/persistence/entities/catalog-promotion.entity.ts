import { defineEntity, p } from '@mikro-orm/core';
import { PROMOTION_STATUSES, PROMOTION_TYPES, PROMOTION_SCOPES, PROMOTION_TARGET_TYPES } from '@rey-one/shared';
import { uuidv7 } from 'uuidv7';
import { tenantDomainFilterConfig } from './configs/doamin-tenant.filter';
import { Domain } from './iam-domain.entity';

const PromotionDiscount = defineEntity({
  name: 'CatalogPromotionDiscount',
  embeddable: true,
  properties: {
    type: p.enum(PROMOTION_TYPES),
    value: p.bigint(),
  },
});

const PromotionEntitySchema = defineEntity({
  name: 'CatalogPromotion',
  tableName: 'promotion',
  filters: tenantDomainFilterConfig,
  indexes: [{ properties: ['domain', 'status', 'startsAt', 'endsAt'] }],
  uniques: [{ properties: ['domain', 'couponCode'] }],
  properties: {
    id: p.uuid().primary().onCreate(uuidv7),
    name: p.string().length(255),
    status: p.enum(PROMOTION_STATUSES), // draft | active | paused | expired
    discount: p.embedded(PromotionDiscount),
    scope: p.enum(PROMOTION_SCOPES), // 'all' | 'specific'
    couponCode: p.string().length(50).nullable().fieldName('coupon_code'),
    startsAt: p.datetime().fieldName('starts_at'),
    endsAt: p.datetime().nullable().fieldName('ends_at'),
    domain: () => p.manyToOne(Domain),
    targets: () => p.oneToMany(PromotionTarget).mappedBy(pt => pt.promotion),
  },
});

export class Promotion extends PromotionEntitySchema.class {}
PromotionEntitySchema.setClass(Promotion);

const PromotionTargetEntitySchema = defineEntity({
  name: 'CatalogPromotionTarget',
  tableName: 'promotion_target',
  filters: tenantDomainFilterConfig,
  indexes: [
    { properties: ['targetType', 'targetId'] },
  ],
  properties: {
    id: p.uuid().primary().onCreate(uuidv7),
    promotion: () => p.manyToOne(Promotion),
    targetType: p.enum(PROMOTION_TARGET_TYPES),
    targetId: p.uuid().fieldName('target_id'), // productId || categoryId
  },
});

export class PromotionTarget extends PromotionTargetEntitySchema.class {}
PromotionTargetEntitySchema.setClass(PromotionTarget);


