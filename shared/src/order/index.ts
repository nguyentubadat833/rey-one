import { OrderStatus } from "./order-type";

export * from "./order-constant";
export * from "./order-type";
export * from './order-schema'

export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  draft: ["pending", "cancelled"],
  pending: ["confirmed", "cancelled", "expired"],
  confirmed: ["processing", "cancelled", "refunded"],
  processing: ["completed", "cancelled", "refunded"],
  completed: ["refunded", "partially_refunded"],
  cancelled: [],
  refunded: [],
  partially_refunded: ["refunded"],
  expired: [],
};
