export const PAYMENT_STATUSES = [
    "pending", // tạo giao dịch nhưng chưa có tiền vào
    "processing", // có thể có tiền vào, chờ xác nhận
    "succeeded", // tiền đã vào, xác nhận thành công
    "failed", // giao dịch không thành công
    "refunded", // hoàn tiền toàn bộ
    "partially_refunded", // hoàn tiền 1 phần
] as const;

export const PAYMENT_PROVIDERS = [
    "sepay",
    "manual",
] as const;

export const SEPAY_PAYMENT_METHODS = [
    "sepay_gateway_bank_transfer",
    "sepay_qrcode_bank_transfer",
] as const

export const PAYMENT_METHODS = [
    ...SEPAY_PAYMENT_METHODS
] as const

export const PAYMENT_FLOW_TYPES = ["qr", "redirect", "manual_info"] as const;

// ===
export type PaymentStatus = typeof PAYMENT_STATUSES[number]
export type PaymentProvider = typeof PAYMENT_PROVIDERS[number]
export type PaymentMethod = typeof PAYMENT_METHODS[number]
export type SepayPaymentMethod = typeof SEPAY_PAYMENT_METHODS[number]
export type PaymentFlowType = typeof PAYMENT_FLOW_TYPES[number]

export type InitPaymentConfig = {
    successUrl?: string;
    errorUrl?: string;
    cancelUrl?: string;
};