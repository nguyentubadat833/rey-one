import { Loaded } from "@mikro-orm/core";
import { User } from "../entities/iam-user.entity";

export type IdentifierType = { username: string } | { email: string } | { phone: string };
export type UserLoadedParty = Loaded<User, 'party'>