import z from "zod";
import { APP_PERMISSIONS } from "../app";
import { UserSchema } from "../user";
import { MetaUI } from "../utils";
import test from "node:test";

// domain
export const DomainSchema = z.object({
  id: z.string().readonly().meta(<MetaUI>{
    label: 'ID',
    component: 'text',
    readonly: true
  }),
  name: z.string().meta(<MetaUI>{
    label: 'Name',
    component: 'text',
    placeholder: "Domain name"
  }),
  active: z.boolean().default(true).meta(<MetaUI>{
    label: "Active",
    component: 'boolean-check'
  }),
  permissions: z.array(z.enum(APP_PERMISSIONS)).default([]).meta(<MetaUI>{
    label: "Permissions",
    component: 'multi-select'
  }),
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
  permissions: z.array(z.enum(APP_PERMISSIONS)).default([]),
});

export const CreateDomainRoleSchema = DomainRoleSchema.omit({
  id: true,
});

export const UpdateDomainRoleSchema = DomainRoleSchema.omit({
  id: true,
}).partial();

// domain member
export const DomainMemberSchema = UserSchema.omit({
  type: true,
}).extend({
  roleId: z.string().nullable().optional(),
});

export const CreateDomainMemberSchema = DomainMemberSchema.omit({
  id: true,
}).extend({
  password: z.string().optional(),
});

export const UpdateDomainMemberSchema = DomainMemberSchema.omit({
  id: true,
})
  .extend({
    password: z.string(),
  })
  .partial();

export const DomainMemberViewSchema = DomainMemberSchema.omit({
  roleId: true,
}).extend({
  role: DomainRoleSchema.nullable(),
});
