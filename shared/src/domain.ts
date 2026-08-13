import z from "zod";
import { APP_PERMISSIONS } from "./app";
import { RoleSummaryView } from "./role";

export const DOMAIN_STATUSES = [
  'active', // Đang hoạt động
  'pending',  // Chưa kích hoạt
  'expiring', // Sắp hết hạn
  'inactive', // Dừng hoạt động
] as const;

export const SUBSCRIPTION_PLANS = [
  'monthly', // gói thanh toán hàng tháng
  'quarterly', // gói thanh toán mỗi 3 tháng
  'half_year', // gói thanh toán mỗi 6 tháng
  'year' // gói thanh toán hàng năm
] as const

// schemas 
export const BaseDomainSchema = z.object({
  name: z.string({ error: "Domain name is required" }),
  permissions: z.array(z.enum(APP_PERMISSIONS)).default([]),
  plan: z.enum(SUBSCRIPTION_PLANS, {error: "Subscription plan is required"}),
  startedAt: z.iso.datetime({error: "Started at is required"}),
  expiresAt: z.iso.datetime().optional(),
});

export const CreateDomainSchema = BaseDomainSchema;
export const UpdateDomainSchema = BaseDomainSchema.omit({
  startedAt: true,
}).partial()

// types
export type SubscriptionPlan = typeof SUBSCRIPTION_PLANS[number]
export type DomainStatus = typeof DOMAIN_STATUSES[number]

export type BaseDomainView = z.infer<typeof BaseDomainSchema> & {
  readonly id: string
  readonly startedAt: string
  readonly status: DomainStatus
}

export type DomainDetailView = BaseDomainView & {
  roles: RoleSummaryView[]
}

export type DomainSummaryView = Omit<BaseDomainView, 'permissions'>