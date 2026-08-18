import { UserLoadedDomain, UserLoadedInfo, UserLoadedInfoAndDomain } from '@/persistence/types/user-type';
import { nullToUndefined } from '@/utils/mappers/falsy-value-mapper';
import { UserAuthResponseDto } from '../dtos/auth-dto';
import { SystemUserDto, UserSummaryDto } from '../dtos/user-dto';
import { User } from '@/persistence/entities/user.entity';
import { DomainPermission, DomainUserPermissionsSchema, SystemPermission, SystemUserPermissionsSchema, SystemUserScopeSchema, UserScope } from '@rey-one/shared';
import { AppError } from '@/utils/errors/app.error';
import { DomainUserDto } from '../dtos/domain-dto';

export class UserMapper {
  static toUserInfo(user: UserLoadedInfo) {
    return {
      id: user.id,
      code: user.code,
      name: user.info.name,
      username: nullToUndefined(user.username),
      email: nullToUndefined(user.email),
      phone: nullToUndefined(user.phone),
      status: user.status,
    };
  }

  static toUserScope(user: UserLoadedDomain): UserScope {
    if (user.domain) {
      return {
        type: 'domain',
        domainId: user.domain.id,
        domainName: user.domain.$.info.name,
        permissions: user.permissions as DomainPermission[],
      };
    } else {
      return {
        type: 'system',
        permissions: user.permissions as SystemPermission[],
      };
    }
  }

  static toUserAuth(user: UserLoadedInfoAndDomain) {
    return {
      ...UserMapper.toUserInfo(user),
      scope: UserMapper.toUserScope(user),
    } satisfies UserAuthResponseDto;
  }

  static toUserSummary(user: User) {
    return {
      ...UserMapper.toUserInfo(user),
    } satisfies UserSummaryDto;
  }

  static toSystemUser(user: UserLoadedInfo) {
    const parsePermissions = SystemUserPermissionsSchema.safeParse(user.permissions);
    if (!parsePermissions.success) throw new AppError('INVALID_VALUE', `Invalid system user`);

    return {
      ...UserMapper.toUserInfo(user),
      permissions: parsePermissions.data,
    } satisfies SystemUserDto;
  }

  static toDomainUser(user: UserLoadedInfoAndDomain) {
    const parsePermissions = DomainUserPermissionsSchema.safeParse(user.permissions);
    if (!parsePermissions.success) throw new AppError('INVALID_VALUE', `Invalid domain user`);

    const domain = user.domain!.getEntity()
    return {
      ...UserMapper.toUserInfo(user),
      permissions: parsePermissions.data,
      domain: {
        id: domain.id,
        code: domain.code,
        name: domain.info.name
      },
    } satisfies DomainUserDto;
  }
}
