import { Product } from '@/persistence/entities/catalog-product.entity';
import { Party } from '@/persistence/entities/iam-party.entity';
import { InvalidProductStatusError } from '@/utils/errors/product.error';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CommerceService {
  constructor() {}

  ensureProductSellable(product: Product) {
    if (product.status !== 'active') {
      throw InvalidProductStatusError();
    }
  }

  ensurePartyCanOrder(party: Party) {}
}
