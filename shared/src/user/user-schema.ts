import z from "zod";
import { zPhoneNumber } from "../phone/phone-schema";
import { USER_STATUSES, USER_TYPES } from "./user-constant";

const usernameSchema = z.string().nullable().optional();
const emailSchema = z.email().nullable().optional();
const phoneSchema = zPhoneNumber("VN").nullable().optional();
const imageSchema = z.url().nullable().optional();

export const BaseLoginSchema = z.object({
  identity: z.string(),
  password: z.string(),
});

export const UserSchema = z.object({
  id: z.string(),
  type: z.enum(USER_TYPES),
  status: z.enum(USER_STATUSES),
  name: z.string(),
  username: usernameSchema,
  phone: phoneSchema,
  email: emailSchema,
  image: imageSchema,
});