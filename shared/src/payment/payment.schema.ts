import z from "zod";
import { PAYMENT_METHODS } from "./payment-type";

export const CreatePaymentSchema = z.object({
  method: z.enum(PAYMENT_METHODS),
  orderId: z.string(),
  successUrl: z.string().optional(),
  cancelUrl: z.string().optional(),
  errorUrl: z.string().optional(),
});
