import { Domain } from '@/persistence/entities/iam-domain.entity';
import { DomainRole } from '@/persistence/entities/iam-domain-role.entity';
import { IDomainSummary } from '@/persistence/entities/query-entities/domain-query';
import {
  DomainLoadedParty,
  DomainLoadedPartyAndRoles,
  DomainLoadedPartyAndRolesAndMembers,
  DomainMemberLoadedDomain,
  DomainMemberLoadedUserAndRole,
  DomainMemberLoadedUserAndRoleAndDomain,
  DomainRoleLoadedMembers,
} from '@/persistence/types/domain-type';
import {
  DomainWithRolesView,
  DomainMemberDetailView,
  DomainMemberView,
  DomainRoleView,
  DomainRoleWithMembersView,
  DomainSummaryView,
  DomainView,
  DomainWithIAMView,
  UserDomainAccess,
  UserView,
} from '@rey-one/shared';

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
      registeredAt: domain.createdAt.toISOString(),
    } satisfies DomainSummaryView;
  }

  static toDomainView(domain: DomainLoadedParty) {
    return {
      id: domain.id,
      name: domain.party.getProperty('name'),
      active: domain.active,
      permissions: domain.permissions,
    } satisfies DomainView;
  }

  static toDomainWithIAMView(domain: DomainLoadedPartyAndRolesAndMembers) {
    return {
      id: domain.id,
      name: domain.party.getProperty('name'),
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

  static toDomainWithRolesView(domain: DomainLoadedPartyAndRoles) {
    return {
      ...DomainMapper.toDomainView(domain),
      roles: domain.roles.getItems().map(item => DomainMapper.toDomainRoleView(item))
    } satisfies DomainWithRolesView;
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

  static toDomainMemberDetailView(member: DomainMemberLoadedUserAndRoleAndDomain) {
    return {
      ...DomainMapper.toDomainMemberView(member),
      domain: {
        id: member.user.getProperty('id'),
        name: member.domain.getProperty('party').getProperty('name'),
      },
    } satisfies DomainMemberDetailView;
  }

  static toUserDomainAccess(domain: DomainLoadedParty) {
    return {
      domainId: domain.id,
      domainName: domain.party.getProperty('name'),
      permissions: [],
    } satisfies UserDomainAccess;
  }

  static memberToUserDomainAccess(member: DomainMemberLoadedDomain) {
    return {
      domainId: member.domain.id,
      domainName: member.domain.getProperty('party').getProperty('name'),
      permissions: member.role?.permissions ?? [],
    } satisfies UserDomainAccess;
  }
}
