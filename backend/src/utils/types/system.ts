import { UserScope } from '@rey-one/shared';
import { ClsStore } from 'nestjs-cls';

export type UserAuth = {
  id: string;
  scope: UserScope
};

export interface AppClsStore extends ClsStore {
  domainId: string | undefined;
  actor: UserAuth | undefined
}