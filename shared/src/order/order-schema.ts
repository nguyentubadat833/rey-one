import z from "zod";
import { ORDER_PAYMENT_TYPES, ORDER_STATUSES } from "./order-constant";
import { CURRENCIES } from "../utils";

export const OrderItemSchema = z.object({
  id: z.uuid(),
  productId: z.uuid(),
  quantity: z.number(),
  subtotal: z.number().transform(BigInt),
  metadata: z.json().nullable(),
});

export const AddOrderItemSchema = OrderItemSchema.omit({
  id: true,
});

export const OrderSchema = z.object({
  id: z.uuid(),
  partyId: z.uuid(),
  paymentType: z.enum(ORDER_PAYMENT_TYPES).default("one_time"),
  status: z.enum(ORDER_STATUSES),
  currency: z.enum(CURRENCIES).default("VND"),
  totalAmount: z.number().transform((v) => BigInt(v)),
  paidAmount: z.number().default(0).transform(BigInt),
  metadata: z.json().nullable(),
  expiresAt: z.date().nullable(),
  completedAt: z.date().nullable(),
  cancelledAt: z.date().nullable(),
  items: z.array(OrderItemSchema),
});

export const CreateOrderSchema = OrderSchema.omit({
  id: true,
  status: true,
  paidAmount: true,
  expiresAt: true,
  completedAt: true,
  cancelledAt: true,
  items: true,
}).extend({
  items: z.array(AddOrderItemSchema),
});

export const UpdateOrderSchema = OrderSchema.omit({
  id: true,
  partyId: true,
  paymentType: true,
  status: true,
  paidAmount: true,
  expiresAt: true,
  completedAt: true,
  cancelledAt: true,
  items: true,
})
  .extend({
    items: z.array(AddOrderItemSchema),
  })
  .partial();
