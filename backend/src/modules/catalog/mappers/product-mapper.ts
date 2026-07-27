import { Product } from '@/persistence/entities/catalog-product.entity';
import { ProductView } from '@rey-one/shared';

export class ProductMapper {
  static toProductView(product: Product) {
    return {
      id: product.id,
      sku: product.sku,
      defaultCost: Number(product.defaultCost),
      currency: product.currency,
      trackingInventory: product.trackInventory,
      name: product.info.name,
      status: product.status,
      type: product.type,
    } satisfies ProductView;
  }
}
