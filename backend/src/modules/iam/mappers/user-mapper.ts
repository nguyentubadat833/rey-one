import { UserLoadedInfo, UserLoadedInfoAndRole, UserLoadedRoleWithDomainAndInfo } from '@/persistence/types/user-type';
import { nullToUndefined } from '@/utils/mappers/falsy-value-mapper';
import { UserAuthResponseDto } from '../dtos/auth-dto';
import { UserDetailDto, UserSummaryDto } from '../dtos/user-dto';
import { RoleMapper } from './role-mapper';
import { DomainMapper } from './domain-mapper';
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

  static userToUserAuth(user: UserLoadedRoleWithDomainAndInfo) {
    const role = user.role.getEntity();
    const domain = role.domain?.getEntity();

    return {
      ...UserMapper.userToUserInfo(user),
      role: { id: role.id, name: role.name },
      domain: domain ? { id: domain.id, name: domain.info.name } : undefined,
    } satisfies UserAuthResponseDto;
  }

  static userToUserSummary(user: UserLoadedInfoAndRole) {
    return {
      ...UserMapper.userToUserInfo(user),
      status: user.status,
      role: user.role.getProperty('name'),
    } satisfies UserSummaryDto;
  }

  static userToUserDetail(user: UserLoadedRoleWithDomainAndInfo){
    const role = user.role.getEntity()

    return {
      id: user.id,
      code: user.code,
      status: user.status,
      name: user.info.name,
      role: RoleMapper.roleToRoleSummary(role),
      domain: role.domain ? DomainMapper.domainToDomainSummary(role.domain.getEntity()) : undefined
    } satisfies UserDetailDto
  }
}
