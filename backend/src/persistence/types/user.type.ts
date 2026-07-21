import { EntityDTO } from "@mikro-orm/core";
import { User } from "../entities/iam.user-entity";

export type UserObject = EntityDTO<Omit<User, 'password'>>;

// export type UserOrganizationWithGroup = Loaded<User, 'group' | 'info'>