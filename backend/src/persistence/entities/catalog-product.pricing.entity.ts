import { defineEntity, p } from '@mikro-orm/core';
import { Product } from './catalog-product.entity';

const ProductPricingEntitySchema = defineEntity({
  name: 'CatalogProductPricing',
  tableName: 'product_pricing',
  properties: {
    id: p.bigint().primary().autoincrement(),
    product: () => p.oneToOne(Product),
    defaultCost: p.integer().fieldName('default_cost')
  },
});

export class ProductPricing extends ProductPricingEntitySchema.class {}
ProductPricingEntitySchema.setClass(ProductPricing);
