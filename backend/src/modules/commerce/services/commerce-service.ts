import { Product } from '@/persistence/entities/catalog-product.entity';
import { Order } from '@/persistence/entities/commerce-order.entity';
import { Party } from '@/persistence/entities/iam-party.entity';
import { OrderLoadedCustomerAndDomain } from '@/persistence/types/order-type';
import { InvalidProductStatusError } from '@/utils/errors/product.error';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CommerceService {
  constructor() { }

  ensureProductSellable(product: Product) {
    if (product.status !== 'active') {
      throw InvalidProductStatusError();
    }
  }

  ensurePartyCanOrder(party: Party) { }

  ensureOrderCanBePayment(order: OrderLoadedCustomerAndDomain) { }
}
