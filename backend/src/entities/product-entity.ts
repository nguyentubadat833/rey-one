import { defineEntity, InferEntity, p } from '@mikro-orm/core';
import { Organization } from './iam.organization-entity';
import { PRODUCT_STATUSES, PRODUCT_TYPES } from '@rey-one/shared';
import { ProductPricing } from './product-pricing-entity';

const ProductEntitySchema = defineEntity({
  name: 'V2Product',
  tableName: 'product',
  properties: {
    id: p.uuid().primary().defaultRaw('gen_random_uuid()'),
    organization: () => p.manyToOne(Organization).inversedBy(org => org.products),
    pricing: () => p.oneToOne(ProductPricing).mappedBy(pricing => pricing.product),
    sku: p.string().length(100).unique(),
    slug: p.string().length(255).unique(),
    name: p.string().length(255),
    description: p.string().length(1000).nullable(),
    status: p.enum(() => PRODUCT_STATUSES).default('draft'),
    type: p.enum(() => PRODUCT_TYPES),
    inventoryTracked: p.boolean().default(false).fieldName('inventory_tracked')
  },
  uniques: [
    {
      properties: ['sku', 'organization'],
    },
  ],

  filters: {
    organization: {
      name: 'organization', 
      cond: (args: { organizationId: string }) => ({ organization: args.organizationId }),
      default: false, // không tự động bật — phải bật thủ công
    },
  },
});

export type IProduct = InferEntity<typeof ProductEntitySchema>;

export class Product extends ProductEntitySchema.class {}

ProductEntitySchema.setClass(Product);
