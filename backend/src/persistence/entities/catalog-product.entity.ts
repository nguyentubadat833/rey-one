import { ChangeSetType, defineEntity, EventArgs, p } from '@mikro-orm/core';
import { CURRENCIES } from '@rey-one/shared';
import { ProductPricing } from './catalog-product.pricing.entity';
import { Domain } from './iam-domain.entity';
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
    owner: () => p.manyToOne(Domain),
    pricing: () => p.oneToOne(ProductPricing).mappedBy((pricing) => pricing.product),
  },
});

export class Product extends ProductEntitySchema.class {}

ProductEntitySchema.setClass(Product);

ProductEntitySchema.addHook('beforeCreate', saveHandler);
ProductEntitySchema.addHook('beforeUpdate', saveHandler);

export function saveHandler(args: EventArgs<Product>) {
  const changeSetType = args.changeSet?.type;
  const changeSetPayload = args.changeSet?.payload;

  if (changeSetType === ChangeSetType.UPDATE) {
    const originalEntity = args.changeSet?.originalEntity;

    if (changeSetPayload?.sku && originalEntity!.sku !== changeSetPayload.sku) {
      throw new AppError('PROPERTY_IMMUTABLE', 'Product sku immutable');
    }
    if (changeSetPayload?.currency && originalEntity!.currency !== changeSetPayload.currency) {
      throw new AppError('PROPERTY_IMMUTABLE', 'Product currency immutable');
    }
    if (changeSetPayload?.owner && originalEntity!.owner !== changeSetPayload.owner) {
      throw new AppError('PROPERTY_IMMUTABLE', 'Product owner immutable');
    }
  }
}

export function generateSku(name: string) {
  const slug = slugify(name, {
    strict: true,
  })
    .slice(0, 15)
    .trim()
    .replace(/-+$/, '')
    .toUpperCase();

  const suffix = crypto.randomUUID().slice(0, 8).toUpperCase();

  return `${slug}-${suffix}`;
}
