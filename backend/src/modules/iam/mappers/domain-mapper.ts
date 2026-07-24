import { Domain } from '@/persistence/entities/iam-domain.entity';
import { DomainRole } from '@/persistence/entities/iam-domain.role.entity';
import { IDomainSummary } from '@/persistence/queries/domain-query';
import { DomainLoadedRolesAndMembers, DomainMemberLoadedUserAndRole, DomainRoleLoadedMembers } from '@/persistence/types/domain-type';
import { DomainMemberView, DomainRoleView, DomainRoleWithMembersView, DomainSummaryView, DomainView, DomainWithIAMView, UserView } from '@rey-one/shared';
import { UserMapper } from './user-mapper';

export class DomainMapper {
  static toDomainSummary(domain: IDomainSummary) {
    return {
      id: domain.id,
      name: domain.name,
      active: domain.active,
      permissions: domain.permissions,
      roleCount: domain.roleCount,
      memberCount: domain.memberCount,
      productCount: domain.productCount,
    } satisfies DomainSummaryView;
  }

  static toDomainView(domain: Domain) {
    return {
      id: domain.id,
      name: domain.name,
      active: domain.active,
      permissions: domain.permissions,
    } satisfies DomainView;
  }

  static toDomainWithIAMView(domain: DomainLoadedRolesAndMembers) {
    return {
      id: domain.id,
      name: domain.name,
      active: domain.active,
      permissions: domain.permissions,
      roles: domain.roles.map(DomainMapper.toDomainRoleView),
      members: domain.members.map(DomainMapper.toDomainMemberView),
    } satisfies DomainWithIAMView;
  }

  static toDomainRoleView(role: DomainRole) {
    return {
      id: role.id,
      name: role.name,
      active: role.active,
      permissions: role.permissions,
    } satisfies DomainRoleView;
  }

  static toDomainRoleWithMembers(role: DomainRoleLoadedMembers) {
    return {
      ...DomainMapper.toDomainRoleView(role),
      members: role.members.map((item) => {
        const userEntity = item.user.getEntity();
        return {
          id: item.user.id,
          username: userEntity.username,
          email: userEntity.email,
          phone: userEntity.phone,
          type: userEntity.type,
          status: userEntity.status,
          name: userEntity.party.getProperty('name'),
        } satisfies UserView;
      }),
    } satisfies DomainRoleWithMembersView;
  }

  static toDomainMemberView(member: DomainMemberLoadedUserAndRole) {
    return {
      id: member.user.$.id,
      name: member.user.$.party.$.name,
      username: member.user.$.username,
      email: member.user.$.email,
      phone: member.user.$.phone,
      status: member.user.$.status,
      role: member.role ? DomainMapper.toDomainRoleView(member.role) : null,
    } satisfies DomainMemberView;
  }
}
