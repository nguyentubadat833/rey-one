import { OrderLoadedCustomerAndCreatedBy, OrderLoadedDomainAndCustomerAndPayments } from "@/persistence/types/order-type";
import { OrderDto, OrderSummaryDto } from "../dtos/order-dto";

export class OrderMapper {
  static toOrderSummaryDto(order: OrderLoadedCustomerAndCreatedBy) {
    return {
      id: order.id,
      paymentType: order.paymentType,
      status: order.status,
      currency: order.currency,
      totalAmount: Number(order.totalAmount),
      paidAmount: Number(order.paidAmount),
      metadata: order.metadata,
      expiresAt: order.expiresAt?.toISOString() ?? null,
      completedAt: order.completedAt?.toISOString() ?? null,
      cancelledAt: order.cancelledAt?.toISOString() ?? null,
      customer: {
        id: order.customer.id,
        name: order.customer.info.name,
      },
      createdBy: {
        id: order.createdBy.id,
        name: order.createdBy.info.name
      },
    } satisfies OrderSummaryDto;
  }

  static toOrderDto(order: OrderLoadedDomainAndCustomerAndPayments) {
    return {
      ...OrderMapper.toOrderSummaryDto(order),
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
    } satisfies OrderDto;
  }
}
