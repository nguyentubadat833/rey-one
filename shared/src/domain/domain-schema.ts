import z from "zod";
import { APP_PERMISSIONS } from "../app";

// domain
export const DomainSchema = z.object({
  id: z.string(),
  name: z.string(),
  active: z.boolean().default(true),
  permissions: z.array(z.enum(APP_PERMISSIONS)),
});

export const CreateDomainSchema = DomainSchema.omit({
  id: true,
});

export const UpdateDomainSchema = DomainSchema.omit({
  id: true,
}).partial();

// domain role
export const DomainRoleSchema = z.object({
  id: z.string(),
  name: z.string(),
  active: z.boolean().default(true),
  permissions: z.array(z.enum(APP_PERMISSIONS)),
});

export const CreateDomainRoleSchema = DomainRoleSchema.omit({
  id: true,
});

export const UpdateDomainRoleSchema = DomainRoleSchema.omit({
  id: true,
}).partial();

// domain member
// export const DomainMemberSchema = UserSchema.omit({
//   type: true,
// });

// export const DomainMemberDetailSchema = DomainMemberSchema.extend({
//   permissions: z.array(z.enum(APP_PERMISSIONS)),
// });

// export const UpdateDomainMemberSchema = DomainMemberSchema.omit({
//   id: true,
//   username: true,
//   email: true,
//   phone: true,
// });