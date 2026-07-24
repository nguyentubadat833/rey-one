import { IUserSummary, UserSummary } from '@/persistence/queries/user-query';
import { UserLoadedParty } from '@/persistence/types/user-type';
import { UserSummaryView, UserView } from '@rey-one/shared';

export class UserMapper {
  static toUserView(user: UserLoadedParty) {
    return {
      id: user.id,
      type: user.type,
      status: user.status,
      name: user.party.getProperty('name'),
      username: user.username,
      phone: user.phone,
      email: user.email,
      image: undefined,
    } satisfies UserView;
  }

  static toUserSummaryView(user: IUserSummary){
    return {
      id: user.id,
      type: user.type,
      status: user.status,
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone,
      memberCount: user.memberCount
    } satisfies UserSummaryView
  }
}
