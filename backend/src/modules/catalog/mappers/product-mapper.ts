import { ProductLoadedInfo } from '@/persistence/types/product-type';
import { ProductDto, ProductSummaryDto } from '../dtos/product-dto';

export class ProductMapper {
  static toProductDto(product: ProductLoadedInfo) {
    return {
      id: product.id,
      sku: product.sku,
      defaultCost: product.defaultCost ? Number(product.defaultCost) : undefined,
      currency: product.currency,
      trackingInventory: product.trackInventory,
      name: product.info.name,
      description: product.info.description,
      status: product.status,
      type: product.type,
    } satisfies ProductDto;
  }

  static toProductSummaryDto(product: ProductLoadedInfo) {
    return {
      id: product.id,
      sku: product.sku,
      currency: product.currency,
      trackingInventory: product.trackInventory,
      name: product.info.name,
      status: product.status,
      type: product.type,
    } satisfies ProductSummaryDto;
  }
}
