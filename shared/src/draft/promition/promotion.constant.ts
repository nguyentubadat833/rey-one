export const PROMOTION_TYPES = [
  "percent",
  "fixed_amount",
  "fixed_price",
] as const;
export const PROMOTION_TARGET_TYPES = ['product', 'category'] as const;
export const PROMOTION_STATUSES = [
  "draft",
  "active",
  "expired",
  "expired",
] as const;
export const PROMOTION_SCOPES = ["all", "specific"] as const;
