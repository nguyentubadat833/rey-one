import z from "zod";
import { UserSchema, UserWithMembersSchema } from "./user-schema";
import {
  USER_TYPES,
  USER_STATUSES,
} from "./user-constant";
import { PaginatedResponse } from "../utils";
import { AppPermission } from "../app";

export type UserType = (typeof USER_TYPES)[number];
export type UserStatus = (typeof USER_STATUSES)[number];

export type UserView = z.infer<typeof UserSchema>
export type UserSummaryView = UserView & {
  memberCount: number;
};
export type UserSummariesView = PaginatedResponse<UserSummaryView>;
export type UserDetailView = z.infer<typeof UserWithMembersSchema>

export type UserDomainAccess = {
  domainId: string;
  domainName: string;
  permissions: AppPermission[];
};

export type UserLoginResponse = {
  accessToken: string;
  user: UserView;
};
