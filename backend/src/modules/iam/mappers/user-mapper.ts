import { IUserSummary } from '@/persistence/entities/query-entities/user-query';
import { UserLoadedMembers, UserLoadedParty } from '@/persistence/types/user-type';
import { UserDetailView, UserSummaryView, UserView } from '@rey-one/shared';
import { DomainMapper } from './domain-mapper';

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

  static toUserDetailView(user: UserLoadedMembers) {
    return {
      ...UserMapper.toUserView(user),
      members: user.members.map((item) => ({
        domain: DomainMapper.toDomainView(item.domain.getEntity()),
        role: item.role ? DomainMapper.toDomainRoleView(item.role) : null,
      })),
    } satisfies UserDetailView;
  }
}
