import z from "zod";
import { CURRENCIES } from "./utils";

export const ORDER_STATUSES = [
  "draft", // đang tạo, chưa submit (giỏ hàng/preview)
  "pending", // đã tạo, chờ thanh toán
  "confirmed", // đã thanh toán / xác nhận, chờ xử lý (fulfillment)
  "processing", // đang xử lý (đóng gói, cấp quyền khoá học, v.v.)
  "completed", // hoàn tất (giao hàng xong / khoá học active / booking đã diễn ra)
  "cancelled", // huỷ trước khi hoàn tất
  "refunded", // đã hoàn tiền (toàn phần)
  "partially_refunded", // hoàn tiền một phần
  "expired", // hết hạn do không thanh toán (timeout pending)
] as const;

// discriminator quyết định order này thuộc "hình thức thanh toán" nào
export const ORDER_PAYMENT_TYPES = [
  "one_time",
  "installment",
  "recurring",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];
export type OrderPaymentType = (typeof ORDER_PAYMENT_TYPES)[number];

// export const INSTALLMENT_STATUSES = [
//   "pending",
//   "paid",
//   "overdue",
//   "waived",
//   "cancelled",
// ] as const;

// export const BILLING_INTERVALS = ["month", "year"] as const;

// export const SUBSCRIPTION_STATUSES = [
//   "trialing",
//   "active",
//   "past_due",
//   "paused",
//   "cancelled",
//   "expired",
// ] as const;

export const ORDER_STATUS_TRANSITIONS: Record<
  OrderStatus,
  readonly OrderStatus[]
> = {
  draft: ["pending", "cancelled"],
  pending: ["confirmed", "cancelled", "expired"],
  confirmed: ["processing", "cancelled", "refunded", "partially_refunded"],
  processing: ["completed", "cancelled", "refunded", "partially_refunded"],
  completed: ["refunded", "partially_refunded"],
  partially_refunded: ["refunded"],
  cancelled: [], // terminal
  refunded: [], // terminal
  expired: [], // terminal
} as const;

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

export const BaseOrderSchema = z.object({
  // id: z.uuid(),
  paymentType: z.enum(ORDER_PAYMENT_TYPES).default("one_time"),
  status: z.enum(ORDER_STATUSES),
  currency: z.enum(CURRENCIES).default("VND"),
  totalAmount: z.number(),
  paidAmount: z.number(),
  metadata: z.any().nullable().optional(),
  expiresAt: z.iso.datetime().nullable(),
  completedAt: z.iso.datetime().nullable(),
  cancelledAt: z.iso.datetime().nullable(),
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

export const CreateOrderSchema = BaseOrderSchema.pick({
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

export const UpdateOrderSchema = BaseOrderSchema.pick({
  metadata: true,
})
  .extend({
    items: z.array(AddOrderItemSchema),
    totalAmount: z.number().transform((v) => BigInt(v)),
  })
  .partial();

export const OrderSchema = BaseOrderSchema.extend({
  id: z.uuid()
})

export const OrderSummarySchema = OrderSchema.omit({
  items: true
})
