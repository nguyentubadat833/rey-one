import { AppPermission, UserType } from '@rey-one/shared';

export type UserAuth = {
  id: string;
  type: UserType;
  domainAccess: Record<string, AppPermission[]>;
};
