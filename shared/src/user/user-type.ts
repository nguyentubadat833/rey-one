import z from "zod";
import { UserSchema } from "./user-schema";
import {
  USER_TYPES,
  USER_PROVIDERS,
  USER_STATUSES,
  OAUTH_PROVIDERS,
} from "./user-constant";
import { PaginatedResponse } from "../utils";
import { AppPermission } from "../app";
import { DomainRoleView, DomainView } from "../domain";

export type UserType = (typeof USER_TYPES)[number];
export type UserProvider = (typeof USER_PROVIDERS)[number];
export type UserStatus = (typeof USER_STATUSES)[number];
export type OAuthProvider = (typeof OAUTH_PROVIDERS)[number];

export type UserView = z.infer<typeof UserSchema>;
export type UserSummaryView = UserView & {
  memberCount: number;
};
export type UserSummariesView = PaginatedResponse<UserSummaryView>;
export type UserDetailView = UserView & {
  members: {
    domain: DomainView
    role?: DomainRoleView | null
  }[]
}

export type UserDomainAccess = {
  domainId: string;
  domainName: string;
  permissions: AppPermission[];
};

export type UserLoginResponse = {
  accessToken: string;
  user: UserView;
};
