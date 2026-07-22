import { User } from '@/persistence/entities/iam-user.entity';
import { UserResponse, UserType, UserInfoResponse } from '@rey-one/shared';

export class UserMapper {
  static toUserInfo(info: User['info']) {
    return {
      name: info.name,
      taxCode: info.taxCode ?? undefined,
      phone: info.phone ?? undefined,
      website: info.website ?? undefined,
      address: info.address ?? undefined,
    } satisfies UserInfoResponse;
  }

  static toUserResponse(user: User) {
    return {
      id: user.id,
      email: user.email ?? undefined,
      isVerified: user.isVerified,
      type: user.type as UserType,
      ...UserMapper.toUserInfo(user.info),
    } satisfies UserResponse;
  }
}
