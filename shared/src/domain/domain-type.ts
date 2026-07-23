import z from "zod";
import { DomainRoleSchema, DomainSchema } from "./domain-schema";

export type DomainView = z.infer<typeof DomainSchema>;
export type DomainSummaryView = DomainView & {
  roleCount: number;
  memberCount: number;
  productCount: number
};

export type DomainRoleView = z.infer<typeof DomainRoleSchema>;
