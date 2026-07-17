import { defineEntity, p } from "@mikro-orm/core";
import { Product } from "./product-entity";
import { CURRENCIES } from "@rey-one/shared";

const ProductPricingEntitySchema = defineEntity({
  name: 'V2ProductPricing',
  tableName: 'product_pricing',
  properties: {
    product: () => p.oneToOne(Product).joinColumn('id').primary().owner(),
    currency: p.enum(() => CURRENCIES),
    defaultCost: p.bigint().nullable().fieldName('default_cost'),
    sellingPrice: p.bigint().nullable().fieldName('selling_price'),
  },
});

export class ProductPricing extends ProductPricingEntitySchema.class {}

ProductPricingEntitySchema.setClass(ProductPricing);