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