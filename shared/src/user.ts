import z from "zod";
import { BaseDomainView } from "./domain";
import { zPhoneNumber } from "./utils";
import { BaseRoleView } from "./role";

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

export const BaseUserSchema = z.object({
  status: z.enum(USER_STATUSES).default("pending"),
  name: z.string({ error: "Name is required" }),
  username: usernameSchema,
  phone: phoneSchema,
  email: emailSchema,
  image: imageSchema,
});

const UserFormSchema = BaseUserSchema.extend({
  roleId: z.string(),
});

export const CreateUserSchema = UserFormSchema;
export const UpdateUserSchema = UserFormSchema.partial();

//types
export type UserStatus = (typeof USER_STATUSES)[number];

export type BaseUserView = z.infer<typeof BaseUserSchema> & {
  readonly id: string;
  readonly code: string
};

export type UserSummaryView = BaseUserView & {
  role: string;
};

export type UserDetailView = BaseUserView & {
  readonly domain?: BaseDomainView;
  role: BaseRoleView;
};

export type UserAuthResponse = Readonly<
  Omit<BaseUserView, 'status'> & {
    role: {
      id: string
      name: string
    }
    domain?: {
      id: string
      name: string
    }
  }
>

export type UserLoginResponse = Readonly<
  {
    accessToken: string;
    userAuth: UserAuthResponse
  }
>
