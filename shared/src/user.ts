import z from "zod";
import { zPhoneNumber } from "./utils";
import {
  DOMAIN_PERMISSIONS,
  DomainPermission,
  SYSTEM_PERMISSIONS,
  SystemPermission,
} from "./app";

export const USER_STATUSES = [
  "pending", // chưa từng kích hoạt
  "inactive", // đã từng kích hoạt nhưng vì lý do gì đó phải inactive
  "active", // đang hoạt động hoạt
  "banned", // chặn vĩnh viễn
  // "deleted",
] as const;

export const USER_DOMAIN_SCOPE_TYPE = "domain" as const;
export const USER_SYSTEM_SCOPE_TYPE = "system" as const;

export type UserStatus = (typeof USER_STATUSES)[number];

export const SystemUserPermissionsSchema = z.array(z.enum(SYSTEM_PERMISSIONS))
export const DomainUserPermissionsSchema = z.array(z.enum(DOMAIN_PERMISSIONS))

export const SystemUserScopeSchema = z.object({
  type: z.literal("system"),
  permissions: SystemUserPermissionsSchema
});

export const DomainUserScopeSchema = z.object({
  type: z.literal("domain"),
  domainId: z.string(),
  domainName: z.string(),
  permissions: DomainUserPermissionsSchema
});

export const UserScopeSchema = z.discriminatedUnion("type", [
  SystemUserScopeSchema,
  DomainUserScopeSchema,
]);
export type UserScope = z.infer<typeof UserScopeSchema>;
export type UserPermissions = SystemPermission[] | DomainPermission[];

export const BaseUserSchema = z.object({
  status: z.enum(USER_STATUSES).default("pending"),
  name: z.string({ error: "Name is required" }),
  username: z.string().optional(),
  phone: zPhoneNumber("VN").optional(),
  email: z.email().optional(),
  image: z.url().optional(),
});

const BaseSystemUserSchema = BaseUserSchema.extend({
  permissions: z.array(z.enum(SYSTEM_PERMISSIONS)).default([]),
});
const BaseDomainUserSchema = BaseUserSchema.extend({
  permissions: z.array(z.enum(DOMAIN_PERMISSIONS)).default([]),
});

export const CreateSystemUserSchema = BaseSystemUserSchema;
export const UpdateSystemUserSchema = BaseSystemUserSchema.extend({
  password: z.string(),
}).partial();

export const CreateDomainUserSchema = BaseDomainUserSchema;
export const UpdateDomainUserSchema = BaseDomainUserSchema.extend({
  password: z.string(),
}).partial();

const UserIdentity = z.object({
  id: z.uuid().readonly(),
  code: z.string().readonly()
});

export const SystemUserSchema = BaseSystemUserSchema.extend(UserIdentity.shape);
export const DomainUserSchema = BaseDomainUserSchema.extend(
  UserIdentity.shape,
).extend({
  domain: z.object({
    id: z.uuid(),
    code: z.string(),
    name: z.string(),
  }),
});

export const UserSummarySchema = BaseUserSchema.extend(UserIdentity.shape)