import { Domain } from '@/persistence/entities/iam-domain.entity';
import { DomainMember } from '@/persistence/entities/iam-domain.member.entity';
import { DomainRole } from '@/persistence/entities/iam-domain.role.entity';
import { IDomainSummary } from '@/persistence/queries/domain-query';
import { DomainMemberLoadedUser } from '@/persistence/types/domain-type';
import { DomainMemberView, DomainRoleView, DomainSummaryView, DomainView } from '@rey-one/shared';

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

  static toDomainRoleView(role: DomainRole) {
    return {
      id: role.id,
      name: role.name,
      active: role.active,
      permissions: role.permissions,
    } satisfies DomainRoleView;
  }

  static toDomainMemberView(member: DomainMemberLoadedUser){
    return {
      id: member.user.$.id,
      name: member.user.$.party.$.name,
      username: member.user.$.username,
      email: member.user.$.email,
      phone: member.user.$.phone,
      status: member.user.$.status,
      roleId: member.role?.id
    } satisfies DomainMemberView
  }
}
