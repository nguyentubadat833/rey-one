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

export interface UserInfoResponse {
  name: string;
  taxCode?: string;
  phone?: string;
  website?: string;
  address?: string;
}

export type UserResponse = UserInfoResponse & {
  id: string;
  email?: string;
  isVerified: boolean;
  type: UserType;
}

export interface LoginResponse {
  token: string;
  user: UserResponse;
}