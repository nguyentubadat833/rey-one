import z from "zod";
import { CURRENCIES } from "./utils";

export const PRODUCT_STATUSES = [
  "draft",
  "active",
  "inactive",
  "archived",
] as const;
export const PRODUCT_TYPES = [
  "digital",
  "physical",
  "service",
  "food_beverage",
] as const;

export type ProductStatus = (typeof PRODUCT_STATUSES)[number];
export type ProductType = (typeof PRODUCT_TYPES)[number];

export const BaseProductSchema = z.object({
  sku: z.string(),
  defaultCost: z.number().nullable().optional(),
  currency: z.enum(CURRENCIES).default("VND"),
  trackingInventory: z.boolean().default(false),
  name: z.string(),
  description: z.string().nullable().optional(),
  status: z.enum(PRODUCT_STATUSES).default("draft"),
  type: z.enum(PRODUCT_TYPES),
});

export const CreateProductSchema = BaseProductSchema.omit({
  sku: true,
}).extend({
  sku: z.string().optional(),
});

export const UpdateProductSchema = BaseProductSchema.omit({
  sku: true,
  type: true,
}).partial();

export const ProductSchema = BaseProductSchema.extend({
  id: z.uuid(),
});

export const ProductSummarySchema = ProductSchema.omit({
  defaultCost: true,
});
