import z from "zod";
import { ProductSchema } from "./product-schema";

export type ProductView = Omit<
  z.infer<typeof ProductSchema>,
  "sku"
> & {
  sku: string;
};

export type ProductSummaryView = Omit<ProductView, 'description'>