import z from "zod";
import { ORDER_PAYMENT_TYPES, ORDER_STATUSES } from "./order-constant";
import { OrderSchema } from "./order-schema";

export type OrderStatus = (typeof ORDER_STATUSES)[number];
export type OrderPaymentType = (typeof ORDER_PAYMENT_TYPES)[number];

export type OrderView = z.infer<typeof OrderSchema>;