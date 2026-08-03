import z from "zod";
import { META_UI_COMPONENTS } from "./util-type";

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(1000).default(20),
});

export const MetaSchema = z.object({
  ui: z.object({
    label: z.string(),
    hidden: z.boolean().optional(),
    placeholder: z.string().optional(),
    icon: z.string().optional(),
    component: z.enum(META_UI_COMPONENTS),
    class: z.string().optional()
  })
})