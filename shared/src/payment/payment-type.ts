import z from "zod";
import { CreatePaymentSchema } from "./payment.schema";

export const PAYMENT_STATUSES = [
  "pending", // tạo giao dịch nhưng chưa có tiền vào
  "processing", // có thể có tiền vào, chờ xác nhận
  "succeeded", // tiền đã vào, xác nhận thành công
  "failed", // giao dịch không thành công
  "refunded", // hoàn tiền toàn bộ
  "partially_refunded", // hoàn tiền 1 phần
] as const;

export const SEPAY_PAYMENT_METHODS = [
  "sepay:gateway:bank-transfer",
  "sepay:qrcode:bank-transfer",
  "manual",
] as const;

export const PAYMENT_METHODS = [...SEPAY_PAYMENT_METHODS] as const;

// ===
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];
export type SepayPaymentMethod = (typeof SEPAY_PAYMENT_METHODS)[number];

export type InitPaymentInput = z.infer<typeof CreatePaymentSchema>
