import { defineEntity, EventArgs, p } from '@mikro-orm/core';
import { CURRENCIES } from '@rey-one/shared';
import { User } from './iam.user-entity';
import { ProductPricing } from './catalog.product-pricing-entity';
import slugify from 'slugify';
import { AppError } from '@/utils/errors/app.error';

const ProductInfoSchema = defineEntity({
  name: 'CatalogProductInfo',
  embeddable: true,
  properties: {
    name: p.string(),
    description: p.text().lazy().ref().nullable(),
  },
});

const ProductEntitySchema = defineEntity({
  name: 'CatalogProduct',
  tableName: 'product',
  properties: {
    id: p.uuid().primary().defaultRaw('gen_random_uuid()'),
    sku: p
      .string()
      .length(100)
      .unique()
      .onCreate((product) => generateSku(product.info.name)),
    currency: p.enum(() => CURRENCIES).default('VND'),
    info: p.embedded(ProductInfoSchema),
    trackInventory: p.boolean().default(false).fieldName('track_inventory'),
    // owner: () =>
    //   p
    //     .manyToOne(User)
    //     .inversedBy((user) => user.products)
    //     .ref(),
    pricing: () => p.oneToOne(ProductPricing).mappedBy((pricing) => pricing.product),
  },
});

export class Product extends ProductEntitySchema.class {}

ProductEntitySchema.setClass(Product);

ProductEntitySchema.addHook('beforeCreate', createHandler);
ProductEntitySchema.addHook('beforeUpdate', updateHandler);

async function createHandler(args: EventArgs<Product>) {
  // const owner = await args.entity.owner.load();
  // User.ensureExists(owner);
  // User.ensureActive(owner);
}

export function updateHandler(args: EventArgs<Product>) {
  // if(args.changeSet?.payload.sku){
  //   throw new AppError('PRODUCT_SKU_IMMUTABLE')
  // }

  // if(args.changeSet?.payload.currency){
  //   throw new AppError('PRODUCT_CURRENCY_IMMUTABLE')
  // }

  // if(args.changeSet?.payload.owner){
  //   throw new AppError('PRODUCT_OWNER_IMMUTABLE')
  // }
}

export function generateSku(name: string) {
  const slug = slugify(name, {
    strict: true,
  })
    .slice(0, 15)
    .trim()
    .replace(/-+$/, '')
    .toUpperCase()

  const suffix = crypto.randomUUID().slice(0, 8).toUpperCase();

  return `${slug}-${suffix}`;
}
