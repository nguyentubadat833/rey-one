import z from "zod";
import { CURRENCIES } from "../utils";
import { PRODUCT_STATUSES, PRODUCT_TYPES } from "./product-constant";

export const ProductSchema = z.object({
  id: z.uuid(),
  sku: z.string().optional(),
  defaultCost: z.number(),
  currency: z.enum(CURRENCIES).default("VND"),
  trackingInventory: z.boolean().default(false),
  name: z.string(),
  description: z.string().nullable().optional(),
  status: z.enum(PRODUCT_STATUSES),
  type: z.enum(PRODUCT_TYPES),
});

export const CreateProductSchema = ProductSchema.omit({
  id: true,
});

export const UpdateProductSchema = ProductSchema.omit({
  id: true,
  sku: true,
  type: true,
});
