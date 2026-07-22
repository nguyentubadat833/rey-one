import z from "zod";
import { APP_PERMISSIONS, USER_STATUSES, USER_TYPES } from "../constants";

export const BaseLoginSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export const UserInfoInputSchema = z.object({
  name: z.string(),
  taxCode: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().optional(),
  address: z.string().optional(),
});

export const UserInputSchema = UserInfoInputSchema.extend({
  type: z.enum(USER_TYPES),
  email: z.string().optional(),
  password: z.string().optional(),
  status: z.enum(USER_STATUSES),
  permissions: z.array(z.enum(APP_PERMISSIONS)),
});

export const UpdateUserInput = UserInputSchema.extend({}).partial();

export const DomainInputSchema = z.object({
  name: z.string(),
  active: z.boolean().default(true),
  permissions: z.array(z.enum(APP_PERMISSIONS)),
});

export const UpdateDomainInputSchema = DomainInputSchema.extend({}).partial();
