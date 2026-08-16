import z from "zod";
import { BaseUserSchema, UserScopeSchema } from "./user";

export const UserAuthResponseSchema = BaseUserSchema.omit({
    status: true
}).extend({
    scope: UserScopeSchema
})

export const BaseLoginSchema = z.object({
    identity: z.string({ error: "Identity is required" }),
    password: z.string({ error: "Password is required" }),
});

export const UserLoginResponseSchema = z.object({
    accessToken: z.string(),
    userAuth: UserAuthResponseSchema
})