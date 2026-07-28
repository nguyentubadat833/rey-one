import { AppPermission, UserType } from '@rey-one/shared';
import { ClsStore } from 'nestjs-cls';

export type UserAuth = {
  id: string;
  type: UserType;
  domainAccess: Record<string, AppPermission[]>;
};

export interface AppClsStore extends ClsStore {
  domainId: string;
}
