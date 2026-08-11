import { OrderLoadedCustomerAndCreatedByAndItems, OrderLoadedCustomerAndCreatedBy } from '@/persistence/types/order-type';
import { OrderView, OrderSummaryView } from '@rey-one/shared';

export class OrderMapper {
  static toOrderSummaryView(order: OrderLoadedCustomerAndCreatedBy) {
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
      customer: {
        id: order.customer.id,
        name: order.customer.name,
      },
      createdBy: {
        id: order.createdBy.id,
        name: order.createdBy.party.getProperty('name'),
      },
    } satisfies OrderSummaryView;
  }

  static toOrderView(order: OrderLoadedCustomerAndCreatedByAndItems) {
    return {
      ...OrderMapper.toOrderSummaryView(order),
      items: order.items.map((item) => ({
        id: item.id,
        product: {
          id: item.product.id,
          name: item.product.info.name,
        },
        quantity: item.quantity,
        subtotal: Number(item.subtotal),
        metadata: item.metadata,
      })),
    } satisfies OrderView;
  }
}
