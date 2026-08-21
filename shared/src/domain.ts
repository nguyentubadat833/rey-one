import z from "zod";
import { USER_STATUSES } from "./user";
import { DOMAIN_PERMISSIONS } from "./app";
import { CURRENCIES } from "./utils";

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

export type SubscriptionPlan = typeof SUBSCRIPTION_PLANS[number]
export type DomainStatus = typeof DOMAIN_STATUSES[number]

// schemas 
const BaseDomainSchema = z.object({
  image: z.url().optional(),
  name: z.string({ error: "Domain name is required" }),
  status: z.enum(DOMAIN_STATUSES),
  permissions: z.array(z.enum(DOMAIN_PERMISSIONS)).default([]),
  currency: z.enum(CURRENCIES).default('VND'),
  price: z.number(),
  plan: z.enum(SUBSCRIPTION_PLANS, { error: "Subscription plan is required" }),
  startedAt: z.iso.datetime({ error: "Started at is required" }),
  expiresAt: z.iso.datetime().optional(),
  owner: z.object({
    email: z.email(),
    status: z.enum(USER_STATUSES)
  })
});

export const CreateDomainSchema = BaseDomainSchema.omit({
  owner: true,
  status: true
}).extend({
  email: z.string()
})

export const UpdateDomainSchema = BaseDomainSchema.omit({
  owner: true,
  startedAt: true,
  status: true
}).partial()

export const DomainSchema = BaseDomainSchema.extend({
  id: z.string().readonly(),
})

export const DomainAvailableSchema = DomainSchema.pick({
  id: true,
  name: true,
  image: true
})

export const DomainSummarySchema = DomainSchema.omit({
  permissions: true
})