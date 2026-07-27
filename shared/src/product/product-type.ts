import z from "zod";
import { ProductSchema } from "./product-schema";

export type ProductView = Omit<
  z.infer<typeof ProductSchema>,
  "description" | "sku"
> & {
  sku: string;
};
