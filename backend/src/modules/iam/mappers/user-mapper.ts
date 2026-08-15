import { UserLoadedInfo } from '@/persistence/types/user-type';
import { nullToUndefined } from '@/utils/mappers/falsy-value-mapper';
import { UserAuthResponseDto } from '../dtos/auth-dto';
import { UserDetailDto, UserSummaryDto } from '../dtos/user-dto';
import { User } from '@/persistence/entities/user.entity';

export class UserMapper {

  static userToUserInfo(user: UserLoadedInfo) {
    return {
      id: user.id,
      code: user.code,
      name: user.info.name,
      username: nullToUndefined(user.username),
      email: nullToUndefined(user.email),
      phone: nullToUndefined(user.phone),
    };
  }

  static userToUserAuth(user: User) {
    const domain = user.domain?.getEntity()
    return {
      ...UserMapper.userToUserInfo(user),
      domain: domain ? { id: domain.id, name: domain.info.name } : undefined,
    } satisfies UserAuthResponseDto;
  }

  static userToUserSummary(user: User) {
    return {
      ...UserMapper.userToUserInfo(user),
      status: user.status,
    } satisfies UserSummaryDto;
  }

  static userToUserDetail(user: User) {
    return {
      id: user.id,
      code: user.code,
      status: user.status,
      name: user.info.name,
    } satisfies UserDetailDto
  }
}
