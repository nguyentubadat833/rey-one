import { AppPermission, UserType } from '@rey-one/shared';

export type UserAuth = {
  id: string;
  type: UserType;
  email: string;
  domainAccess: Record<string, AppPermission[]>;
};
