import { PaymentStatus } from "./payment-type";

export * from "./payment-constant";
export * from "./payment-type";

export const PAYMENT_STATUS_TRANSITIONS: Record<
  PaymentStatus,
  PaymentStatus[]
> = {
  pending: ["processing", "succeeded", "failed"],
  processing: ["succeeded", "failed"],
  succeeded: ["refunded", "partially_refunded"],
  failed: [], // Payment failed thì đóng lại, tạo Payment MỚI để retry, không mở lại cái cũ
  refunded: [],
  partially_refunded: ["refunded"], // hoàn thêm phần còn lại → thành hoàn toàn bộ
};
