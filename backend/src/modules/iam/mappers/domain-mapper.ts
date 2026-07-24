import { Domain } from '@/persistence/entities/iam-domain.entity';
import { DomainRole } from '@/persistence/entities/iam-domain.role.entity';
import { IDomainSummary } from '@/persistence/queries/domain-query';
import { DomainRoleView, DomainSummaryView, DomainView } from '@rey-one/shared';

export class DomainMapper {
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
}
