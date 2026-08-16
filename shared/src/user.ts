import z from "zod";
import { zPhoneNumber } from "./utils";
import { DOMAIN_PERMISSIONS, DomainPermission, SYSTEM_PERMISSIONS, SystemPermission } from "./app";

export const USER_STATUSES = [
  "pending", // chưa từng kích hoạt
  "inactive", // đã từng kích hoạt nhưng vì lý do gì đó phải inactive
  "active", // đang hoạt động hoạt
  "banned", // chặn vĩnh viễn
  // "deleted",
] as const;

export const USER_DOMAIN_SCOPE_TYPE = 'domain' as const
export const USER_SYSTEM_SCOPE_TYPE = 'system' as const

export type UserStatus = (typeof USER_STATUSES)[number];

export const SystemUserScopeSchema = z.object({
  type: z.literal('system'),
  permissions: z.array(z.enum(SYSTEM_PERMISSIONS))
})

export const DomainUserScopeSchema = z.object({
  type: z.literal('domain'),
  permissions: z.array(z.enum(DOMAIN_PERMISSIONS))
})

export const UserScopeSchema = z.discriminatedUnion('type', [
  SystemUserScopeSchema,
  DomainUserScopeSchema
])
export type UserScope = z.infer<typeof UserScopeSchema>
export type UserPermissions = SystemPermission[] | DomainPermission[]

const usernameSchema = z.string().optional();
const emailSchema = z.email().optional();
const phoneSchema = zPhoneNumber("VN").optional();
const imageSchema = z.url().optional();

export const BaseUserSchema = z.object({
  status: z.enum(USER_STATUSES).default("pending"),
  name: z.string({ error: "Name is required" }),
  username: usernameSchema,
  phone: phoneSchema,
  email: emailSchema,
  image: imageSchema,
});

const BaseSystemUserSchema = BaseUserSchema.extend({
  permissions: z.array(z.enum(SYSTEM_PERMISSIONS)).default([])
})
const BaseDomainUserSchema = BaseUserSchema.extend({
  permissions: z.array(z.enum(DOMAIN_PERMISSIONS)).default([])
})

export const CreateSystemUserSchema = BaseSystemUserSchema;
export const UpdateSystemUserSchema = BaseSystemUserSchema.extend({
  password: z.string()
}).partial();

export const CreateDomainUserSchema = BaseDomainUserSchema;
export const UpdateDomainUserSchema = BaseDomainUserSchema.extend({
  password: z.string()
}).partial();

export const SystemUserSchema = BaseSystemUserSchema.extend({
  id: z.uuid().readonly(),
  code: z.string().readonly()
})
export const DomainUserSchema = BaseDomainUserSchema.extend({
  id: z.uuid().readonly(),
  code: z.string().readonly()
})