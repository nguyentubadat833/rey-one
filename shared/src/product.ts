import z from "zod";
import { CURRENCIES } from "./utils";

export const PRODUCT_STATUSES = ['draft', 'active', 'inactive', 'archived'] as const;
export const PRODUCT_TYPES = ['digital', 'physical', 'service', 'food_beverage'] as const

export type ProductStatus = typeof PRODUCT_STATUSES[number]
export type ProductType = typeof PRODUCT_TYPES[number]

export const ProductSchema = z.object({
  id: z.uuid(),
  sku: z.string().optional(),
  defaultCost: z.number().nullable().optional(),
  currency: z.enum(CURRENCIES).default("VND"),
  trackingInventory: z.boolean().default(false),
  name: z.string(),
  description: z.string().nullable().optional(),
  status: z.enum(PRODUCT_STATUSES).default('draft'),
  type: z.enum(PRODUCT_TYPES),
});

export const CreateProductSchema = ProductSchema.omit({
  id: true,
});

export const UpdateProductSchema = ProductSchema.omit({
  id: true,
  sku: true,
  type: true,
}).partial()

export type ProductView = Omit<
  z.infer<typeof ProductSchema>,
  "sku"
> & {
  sku: string;
};

export type ProductSummaryView = Omit<ProductView, 'description'>