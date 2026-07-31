import { Product } from '@/persistence/entities/catalog-product.entity';
import { InvalidProductStatusError } from '@/utils/errors/product.error';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CommerceService {
  constructor() {}

  static ensureProductSellable(product: Product) {
    if (product.status !== 'active') {
      throw InvalidProductStatusError();
    }
  }
}
