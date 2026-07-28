import { ProductLoadedInfo } from '@/persistence/types/product-type';
import { ProductSummaryView, ProductView } from '@rey-one/shared';

export class ProductMapper {
  static toProductView(product: ProductLoadedInfo) {
    return {
      id: product.id,
      sku: product.sku,
      defaultCost: Number(product.defaultCost),
      currency: product.currency,
      trackingInventory: product.trackInventory,
      name: product.info.name,
      description: product.info.description,
      status: product.status,
      type: product.type,
    } satisfies ProductView;
  }

  static toProductSummary(product: ProductLoadedInfo) {
    return {
      id: product.id,
      sku: product.sku,
      defaultCost: Number(product.defaultCost),
      currency: product.currency,
      trackingInventory: product.trackInventory,
      name: product.info.name,
      status: product.status,
      type: product.type,
    } satisfies ProductSummaryView;
  }
}
