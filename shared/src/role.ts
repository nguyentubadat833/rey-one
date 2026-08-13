import z from "zod";
import { APP_PERMISSIONS } from "./app";

export const BaseRoleSchema = z.object({
  name: z.string({ error: "Name is required" }),
  active: z.boolean().default(true),
  permissions: z.array(z.enum(APP_PERMISSIONS)),
});

export const CreateRoleSchema = BaseRoleSchema;
export const UpdateRoleSchema = BaseRoleSchema.partial();

export type BaseRoleView = z.infer<typeof BaseRoleSchema> & {
  readonly id: string;
};

export type RoleSummaryView = Omit<BaseRoleView, 'permissions'>