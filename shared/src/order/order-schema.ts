import z from "zod";
import { ORDER_PAYMENT_TYPES, ORDER_STATUSES } from "./order-constant";
import { CURRENCIES } from "../utils";

export const OrderItemSchema = z.object({
  id: z.uuid(),
  product: z.object({
    id: z.uuid(),
    name: z.string(),
  }),
  quantity: z.number().default(1),
  subtotal: z.number(),
  metadata: z.any().nullable().optional(),
});

export const AddOrderItemSchema = OrderItemSchema.omit({
  id: true,
  product: true,
  subtotal: true,
}).extend({
  productId: z.string(),
  subtotal: z.number().transform(BigInt),
});

export const OrderSchema = z.object({
  id: z.uuid(),
  paymentType: z.enum(ORDER_PAYMENT_TYPES).default("one_time"),
  status: z.enum(ORDER_STATUSES),
  currency: z.enum(CURRENCIES).default("VND"),
  totalAmount: z.number(),
  paidAmount: z.number(),
  metadata: z.any().nullable().optional(),
  expiresAt: z.date().nullable(),
  completedAt: z.date().nullable(),
  cancelledAt: z.date().nullable(),
  items: z.array(OrderItemSchema),
  customer: z.object({
    id: z.uuid(),
    name: z.string(),
  }),
  createdBy: z.object({
    id: z.uuid(),
    name: z.string(),
  }),
});

export const CreateOrderQuerySchema = z.object({
  paymentType: z.enum(ORDER_PAYMENT_TYPES),
});

export const CreateOrderSchema = OrderSchema.pick({
  currency: true,
  metadata: true,
}).extend({
  customer: z.object({
    id: z.uuid().optional(),
    name: z.string(),
  }),
  totalAmount: z.number().transform((v) => BigInt(v)),
  items: z.array(AddOrderItemSchema),
});

export const CustomerCreateOrderSchema = CreateOrderSchema.omit({
  customer: true,
});

export const UpdateOrderSchema = OrderSchema.pick({
  metadata: true,
})
  .extend({
    items: z.array(AddOrderItemSchema),
    totalAmount: z.number().transform((v) => BigInt(v)),
  })
  .partial();
