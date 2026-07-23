import z from "zod";
import { UserSchema } from "./user-schema";
import { USER_TYPES, USER_PROVIDERS, USER_STATUSES, OAUTH_PROVIDERS } from "./user-constant";

export type UserType = (typeof USER_TYPES)[number];
export type UserProvider = (typeof USER_PROVIDERS)[number];
export type UserStatus = (typeof USER_STATUSES)[number];
export type OAuthProvider = (typeof OAUTH_PROVIDERS)[number];

export type UserView = z.infer<typeof UserSchema>;

export type UserLoginResponse = {
  accessToken: string;
  user: UserView;
};