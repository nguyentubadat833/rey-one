import { ORDER_PAYMENT_TYPES, ORDER_STATUSES } from "./order-constant";

export type OrderStatus = (typeof ORDER_STATUSES)[number];
export type OrderPaymentType = (typeof ORDER_PAYMENT_TYPES)[number];
