import { SystemPermission } from '@rey-one/shared';
import { ClsStore } from 'nestjs-cls';

// export type UserAuth = {
//   id: string;
//   type: UserType;
//   domainAccess: Record<string, AppPermission[]>;
// };

export type UserAuth = {
  id: string; // user id
  scope: {
    type: ''
  }
};

export interface AppClsStore extends ClsStore {
  domainId: string | undefined;
  actor: UserAuth | undefined
}
