import z from "zod";

export const BaseLoginSchema = z.object({
    email: z.string(),
    password: z.string()
})