import { OrderLoadedCustomerAndCreatedByAndItems } from '@/persistence/types/order-type';
import { OrderView } from '@rey-one/shared';

export class OrderMapper {
  static toOrderView(order: OrderLoadedCustomerAndCreatedByAndItems) {
    return {
      id: order.id,
      paymentType: order.paymentType,
      status: order.status,
      currency: order.currency,
      totalAmount: Number(order.totalAmount),
      paidAmount: Number(order.paidAmount),
      metadata: order.metadata,
      expiresAt: order.expiresAt ?? null,
      completedAt: order.completedAt ?? null,
      cancelledAt: order.cancelledAt ?? null,
      items: order.items.map((item) => ({
        id: item.id,
        product: {
          id: item.product.id,
          name: item.product.info.name,
        },
        quantity: item.quantity,
        subtotal: Number(item.subtotal),
        metadata: item.metadata
      })),
      customer: {
        id: order.customer.id,
        name: order.customer.name,
      },
      createdBy: {
        id: order.createdBy.id,
        name: order.createdBy.party.getProperty('name'),
      },
    } satisfies OrderView;
  }
}
