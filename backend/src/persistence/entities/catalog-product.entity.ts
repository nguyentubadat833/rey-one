import { ChangeSetType, defineEntity, EventArgs, p } from '@mikro-orm/core';
import { CURRENCIES, PRODUCT_STATUSES, PRODUCT_TYPES } from '@rey-one/shared';
import { ProductPricing } from './commerce-product-pricing.entity';
import { Domain } from './iam-domain.entity';
import slugify from 'slugify';
import { AppError } from '@/utils/errors/app.error';
import { tenantDomainFilterConfig } from './configs/doamin-tenant.filter';

const ProductInfoSchema = defineEntity({
  name: 'CatalogProductInfo',
  embeddable: true,
  properties: {
    name: p.string(),
    description: p.text().nullable(),
  },
});

const ProductEntitySchema = defineEntity({
  name: 'CatalogProduct',
  tableName: 'product',
  filters: tenantDomainFilterConfig,
  properties: {
    id: p.uuid().primary().defaultRaw('gen_random_uuid()'),
    sku: p
      .string()
      .length(100)
      .unique()
      .onCreate((product) => generateSku(product.info.name)),
    currency: p.enum(CURRENCIES).default('VND'),
    defaultCost: p.bigint().fieldName('default_cost').nullable(),
    info: p.embedded(ProductInfoSchema).lazy(),
    trackInventory: p.boolean().default(false).fieldName('track_inventory'),
    status: p.enum(PRODUCT_STATUSES).default('draft'),
    type: p.enum(PRODUCT_TYPES),
    domain: () => p.manyToOne(Domain),
    pricing: () =>
      p
        .oneToOne(ProductPricing)
        .mappedBy((pricing) => pricing.product)
        .nullable(),
  },
});

export class Product extends ProductEntitySchema.class {

  isDraft() {
    return this.status === 'draft'
  }

  ensureNotArchived() {
    if (this.status === 'archived') {
      throw new AppError('INVALID_STATUS', 'Invalid product status, required not archived');
    }
  }

  ensureNotDraft() {
    if (!this.isDraft()) {
      throw new AppError('INVALID_STATUS', 'Invalid product status, required draf value');
    }
  }
}

ProductEntitySchema.setClass(Product);

ProductEntitySchema.addHook('beforeCreate', saveHandler);
ProductEntitySchema.addHook('beforeUpdate', saveHandler);

export function saveHandler(args: EventArgs<Product>) {
  const changeSetType = args.changeSet?.type;
  const changeSetPayload = args.changeSet?.payload;

  if (changeSetType === ChangeSetType.UPDATE) {
    args.entity.ensureNotArchived();

    const entity = args.entity;

    if (changeSetPayload?.sku && entity!.sku !== changeSetPayload.sku) {
      throw new AppError('PROPERTY_IMMUTABLE', 'Product sku immutable');
    }

    if (changeSetPayload?.type && entity!.type !== changeSetPayload.type) {
      throw new AppError('PROPERTY_IMMUTABLE', 'Product type immutable');
    }

    if (changeSetPayload?.domain && entity!.domain !== changeSetPayload.domain) {
      throw new AppError('PROPERTY_IMMUTABLE', 'Product owner immutable');
    }

    if (changeSetPayload?.currency && !entity.isDraft() && entity!.currency !== changeSetPayload.currency) {
      throw new AppError('PROPERTY_IMMUTABLE', 'Product currency immutable');
    }

    if (changeSetPayload?.trackInventory && !entity.isDraft() && entity!.trackInventory !== changeSetPayload.trackInventory) {
      throw new AppError('PROPERTY_IMMUTABLE', 'Product track inventory immutable');
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
