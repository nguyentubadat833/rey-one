import { User } from '@/persistence/entities/iam.user-entity';
import { MeResponse, UserType } from '@rey-one/shared';

export class UserMapper {
  static toMeResponse(user: User) {
    return {
      id: user.id,
      email: user.email,
      isVerified: user.isVerified,
      type: user.type as UserType,
      permissions: user.permissions,
      info: {
        name: user.info.name,
        taxCode: user.info.taxCode ?? undefined,
      }
    } satisfies MeResponse
  }
}
