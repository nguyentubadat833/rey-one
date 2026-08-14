import z from "zod";
import {DomainSchema, DomainSummarySchema } from "./domain";
import { zPhoneNumber } from "./utils";
import { RoleSchema, RoleSummarySchema } from "./role";

export const USER_TYPES = [

] as const

export const USER_STATUSES = [
  "pending", // chưa từng kích hoạt
  "inactive", // đã từng kích hoạt nhưng vì lý do gì đó phải inactive
  "active", // đang hoạt động hoạt
  "banned", // chặn vĩnh viễn
  // "deleted",
] as const;

// schemas
const usernameSchema = z.string().optional();
const emailSchema = z.email().optional();
const phoneSchema = zPhoneNumber("VN").optional();
const imageSchema = z.url().optional();

export const BaseLoginSchema = z.object({
  identity: z.string({ error: "Identity is required" }),
  password: z.string({ error: "Password is required" }),
});

const BaseSchema = z.object({
  status: z.enum(USER_STATUSES).default("pending"),
  name: z.string({ error: "Name is required" }),
  username: usernameSchema,
  phone: phoneSchema,
  email: emailSchema,
  image: imageSchema,
});

const UserFormSchema = BaseSchema.extend({
  roleId: z.string(),
});

export const CreateUserSchema = UserFormSchema;
export const UpdateUserSchema = UserFormSchema.partial();

//types
export type UserStatus = (typeof USER_STATUSES)[number];

export const UserSchema = BaseSchema.extend({
  id: z.uuid().readonly(),
  code: z.string().readonly()
})

export const UserSummarySchema = UserSchema.extend({
  role: z.string()
})

export const UserDetailSchema = UserSchema.extend({
  domain: DomainSummarySchema.optional(),
  role: RoleSummarySchema
})

export const UserAuthResponseSchema = UserSchema.omit({
  status: true
}).extend({
  role: RoleSchema.pick({
    id: true,
    name: true
  }),
  domain: DomainSchema.pick({
    id: true,
    name: true
  }).optional()
})

export const UserLoginResponseSchema = z.object({
  accessToken: z.string(),
  userAuth: UserAuthResponseSchema
})