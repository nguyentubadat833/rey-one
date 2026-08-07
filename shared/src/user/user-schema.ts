import { z } from "zod";
import { zPhoneNumber } from "../phone/phone-schema";
import { USER_STATUSES, USER_TYPES } from "./user-constant";

const usernameSchema = z.string().nullable().optional();
const emailSchema = z.email().nullable().optional();
const phoneSchema = zPhoneNumber("VN").nullable().optional();
const imageSchema = z.url().nullable().optional();

export const BaseLoginSchema = z.object({
  identity: z.string({ error: "Identity is required" }),
  password: z.string({ error: "Password is required" }),
});

export const UserMemberSchema = z.object({
  domain: z.object({
    id: z.string(),
    name: z.string(),
  }),
  role: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .nullable()
    .optional(),
});

export const UserSchema = z.object({
  id: z.string().readonly(),
  type: z.enum(USER_TYPES, { error: "User type is required" }),
  status: z.enum(USER_STATUSES).default("pending"),
  name: z.string({ error: "Name is required" }),
  username: usernameSchema,
  phone: phoneSchema,
  email: emailSchema,
  image: imageSchema,
});

export const UserWithMembersSchema = UserSchema.extend({
  members: z.array(UserMemberSchema).default([]),
});

const UserFormSchema = UserWithMembersSchema.omit({
  id: true,
  type: true,
}).extend({
  password: z.string().optional(),
});

export const CreateUserSchema = UserFormSchema
export const UpdateUserSchema = UserFormSchema.partial()