import { Loaded } from "@mikro-orm/core";
import { User } from "../entities/iam.user-entity";

export type UserOrganizationWithGroup = Loaded<User, 'group' | 'info'>