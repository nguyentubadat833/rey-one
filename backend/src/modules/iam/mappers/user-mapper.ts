import { UserLoadedParty } from '@/persistence/types/user-type';
import { UserView } from '@rey-one/shared';

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
}
