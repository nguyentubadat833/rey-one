export const PAYMENT_STATUSES = [
  "pending", // tạo giao dịch nhưng chưa có tiền vào
  "processing", // có thể có tiền vào, chờ xác nhận
  "succeeded", // tiền đã vào, xác nhận thành công
  "failed", // giao dịch không thành công
  "refunded", // hoàn tiền toàn bộ
  "partially_refunded", // hoàn tiền 1 phần
] as const;

export const PAYMENT_PROVIDERS = [
  "sepay_gateway",
  "sepay_vietqr",
  "manual",
] as const;

export const PAYMENT_FLOW_TYPES = ["qr", "redirect", "manual_info"] as const;
