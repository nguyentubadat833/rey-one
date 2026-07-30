import { PAYMENT_PROVIDERS, PAYMENT_STATUSES } from "./payment-constant";

export type PaymentStatus = typeof PAYMENT_STATUSES[number]
export type PaymentProvider = typeof PAYMENT_PROVIDERS[number]