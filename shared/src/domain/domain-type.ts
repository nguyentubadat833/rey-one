import z from "zod";
import {
  DomainMemberViewSchema,
  DomainRoleSchema,
  DomainSchema,
} from "./domain-schema";

// Domain
export type DomainView = z.infer<typeof DomainSchema>;
export type DomainSummaryView = DomainView & {
  roleCount: number;
  memberCount: number;
  productCount: number;
};

// Domain role
export type DomainRoleView = z.infer<typeof DomainRoleSchema>;

// Domain member
export type DomainMemberView = z.infer<typeof DomainMemberViewSchema> 
