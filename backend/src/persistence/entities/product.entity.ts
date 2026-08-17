import { ChangeSetType, defineEntity, EventArgs } from '@mikro-orm/core';
import { CURRENCIES, PRODUCT_STATUSES, PRODUCT_TYPES } from '@rey-one/shared';
import { Domain } from './domain.entity';
import { AppError } from '@/utils/errors/app.error';
import { uuidv7 } from 'uuidv7';
import { BaseEntitySchema } from './base.entity';
import { OrderItem } from './order.entity';
import { domainFilter } from './configs/doamin-tenant.filter';
import randomstring from 'randomstring';
import slugify from 'slugify';

const ProductInfoSchema = defineEntity({
  name: 'ProductInfo',
  properties: (p) => ({
    product: () => p.oneToOne(Product).primary().owner(),

    name: p.string(),
    description: p.text().nullable(),
  }),
});

const ProductEntitySchema = defineEntity({
  name: 'ProductEntity',
  tableName: 'product',
  filters: domainFilter,
  extends: BaseEntitySchema,
  properties: (p) => ({
    id: p.uuid().primary().onCreate(uuidv7),
    slug: p.string().unique().onCreate((product) => generateSlug(product.info.name)),
    sku: p
      .string()
      .length(100)
      .unique()
      .onCreate((product) => generateSku(product.info.name)),
    currency: p.enum(CURRENCIES).default('VND'),
    defaultCost: p.bigint().fieldName('default_cost').nullable(),
    trackInventory: p.boolean().default(false).fieldName('track_inventory'),
    status: p.enum(PRODUCT_STATUSES).default('draft'),
    type: p.enum(PRODUCT_TYPES),
    //
    info: () => p.oneToOne(ProductInfoSchema).mappedBy(info => info.product),
    domain: () => p.manyToOne(Domain),
    orderItems: () => p.oneToMany(OrderItem).mappedBy((orderItem) => orderItem.product),
  }),
});

export class Product extends ProductEntitySchema.class {

  isDraft() {
    return this.status === 'draft';
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

  const suffix = randomstring.generate({
    length: 7,
    charset: '23456789QWERTYUPASDFGHKLMNBVCXZ',
  });

  return `${slug}-${suffix}`;
}

export function generateSlug(name: string) {
  const slug = slugify(name, {
    strict: true,
  })
    .slice(0, 249)
    .trim()
    .replace(/-+$/, '')
    .toUpperCase();

  const suffix = randomstring.generate({
    length: 5,
    charset: '23456789QWERTYUPASDFGHKLMNBVCXZ',
  });
  return `${slug}-${suffix}`;
}