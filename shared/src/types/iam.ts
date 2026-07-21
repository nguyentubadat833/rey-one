import {
  AppPermission,
  OAUTH_PROVIDERS,
  USER_PROVIDERS,
  USER_STATUSES,
  USER_TYPES,
} from "..";

export type UserType = (typeof USER_TYPES)[number];
export type UserProvider = (typeof USER_PROVIDERS)[number];
export type UserStatus = (typeof USER_STATUSES)[number];
export type OAuthProvider = (typeof OAUTH_PROVIDERS)[number];

export interface MeResponse {
  id: string;
  email: string;
  isVerified: boolean;
  type: UserType;
  permissions: AppPermission[];
  info: {
    name: string;
    taxCode?: string;
  };
}

export interface LoginResponse {
  token: string;
  user: MeResponse;
}
