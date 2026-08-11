import z from "zod";
import { ProductSchema } from "./product-schema";
import { PRODUCT_STATUSES, PRODUCT_TYPES } from "./product-constant";

export type ProductStatus = typeof PRODUCT_STATUSES[number]
export type ProductType = typeof PRODUCT_TYPES[number]

export type ProductView = Omit<
  z.infer<typeof ProductSchema>,
  "sku"
> & {
  sku: string;
};

export type ProductSummaryView = Omit<ProductView, 'description'>