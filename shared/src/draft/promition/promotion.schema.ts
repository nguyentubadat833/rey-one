import z from "zod";
import { PRODUCT_TYPES } from "../../product";
import { PROMOTION_TARGET_TYPES } from "./promotion.constant";

const PromotionSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  type: z.enum(PRODUCT_TYPES),
  discountValue: z.number().int().positive(),
  couponCode: z.string().nullable().optional(),
  startAt: z.iso.datetime(),
  endAt: z.iso.datetime().nullable().optional(),
  targetType: z.enum(PROMOTION_TARGET_TYPES),
});

export const CreatePromotionSchema = PromotionSchema.omit({
  id: true,
}).refine((data) => !data.endAt || data.endAt > data.startAt, {
  message: "endAt must be after startAt",
  path: ["endAt"],
});

export const UpdatePromotionSchema = PromotionSchema.omit({
  id: true,
})
  .partial()
  .refine((data) => !data.endAt || !data.startAt || data.endAt > data.startAt, {
    message: "endAt must be after startAt",
    path: ["endAt"],
  });
