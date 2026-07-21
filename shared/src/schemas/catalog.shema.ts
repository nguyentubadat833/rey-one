import z from "zod";
import { CURRENCIES } from "../constants";

export const ProductInfoSchema = z.object({
  name: z.string(),
  description: z.string().transform((val) => {
    if (val && val.trim().length) {
      return val;
    } else {
      return undefined;
    }
  }),
});

export const ProductPricingSchema = z.object({
  defaultCost: z.number(),
});

export const ProductInputSchema = z.object({
  ownerId: z.string(),
  sku: z
    .string()
    .min(5)
    .transform((val) => {
      if (val && val.trim().length > 5) {
        return val;
      } else {
        return undefined;
      }
    }),
  currency: z.enum(CURRENCIES).default("VND"),
  trackInventory: z.boolean().default(false),
  info: ProductInfoSchema,
  pricing: ProductPricingSchema,
});

export const ProductUpdateInputSchema = ProductInputSchema.omit({
  sku: true,
  ownerId: true,
  currency: true
});
