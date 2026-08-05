import { IUserSummary } from '@/persistence/entities/query-entities/user-query';
import { UserLoadedParty, UserLoadedPartyAndMembers } from '@/persistence/types/user-type';
import { UserSummaryView, UserView, UserAuthResponse } from '@rey-one/shared';

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

  static toUserSummaryView(user: IUserSummary) {
    return {
      id: user.id,
      type: user.type,
      status: user.status,
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone,
      memberCount: user.memberCount,
    } satisfies UserSummaryView;
  }

  static toUserAuth(user: UserLoadedPartyAndMembers) {
    return {
      acessDomains: user.members.map((item) => ({
        domainId: item.domain.getProperty('id'),
        domainName: item.domain.getProperty('name'),
        accessPermissions: item.role?.permissions ?? [],
      })),
      user: UserMapper.toUserView(user),
    } satisfies UserAuthResponse;
  }

  static toUserAccessDomain(){

  }
}
