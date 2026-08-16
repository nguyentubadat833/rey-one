import { UserLoadedInfo } from '@/persistence/types/user-type';
import { nullToUndefined } from '@/utils/mappers/falsy-value-mapper';
import { UserAuthResponseDto } from '../dtos/auth-dto';
import { UserDto, UserSummaryDto } from '../dtos/user-dto';
import { User } from '@/persistence/entities/user.entity';

export class UserMapper {

  static toUserInfo(user: UserLoadedInfo) {
    return {
      id: user.id,
      code: user.code,
      name: user.info.name,
      username: nullToUndefined(user.username),
      email: nullToUndefined(user.email),
      phone: nullToUndefined(user.phone),
    };
  }

  static toUserAuth(user: User) {
    const domain = user.domain?.getEntity()
    return {
      ...UserMapper.toUserInfo(user),
      domain: domain ? { id: domain.id, name: domain.info.name } : undefined,
    } satisfies UserAuthResponseDto;
  }

  static toUserSummary(user: User) {
    return {
      ...UserMapper.toUserInfo(user),
      status: user.status,
    } satisfies UserSummaryDto;
  }

  static toUser(user: User) {
    return {
      id: user.id,
      code: user.code,
      status: user.status,
      name: user.info.name,
    } satisfies UserDto
  }
}
