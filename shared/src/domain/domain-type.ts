import z from "zod";
import {
  DomainMemberViewSchema,
  DomainRoleSchema,
  DomainSchema,
} from "./domain-schema";
import { UserView } from "../user";
import { PaginatedResponse } from "../utils";

// Domain
export type DomainView = z.infer<typeof DomainSchema>;
export type DomainSummaryView = DomainView & {
  roleCount: number;
  memberCount: number;
  productCount: number;
};
export type DomainSummariesView = PaginatedResponse<DomainSummaryView>

// Domain role
export type DomainRoleView = z.infer<typeof DomainRoleSchema>;
export type DomainRoleWithMembersView = DomainRoleView & {
  members: UserView[]
}

// Domain member
export type DomainMemberView = z.infer<typeof DomainMemberViewSchema> 
export type DomainMemberDetailView = DomainMemberView & {
  domain: Omit<DomainView, 'active' | 'permissions'>
}

// Domain detail
export type DomainWithIAMView =  DomainView & {
  roles: DomainRoleView[],
  members: DomainMemberView[],
}
