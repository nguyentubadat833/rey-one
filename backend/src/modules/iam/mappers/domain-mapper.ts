import { Domain } from '@/persistence/entities/iam-domain.entity';
import { DomainRole } from '@/persistence/entities/iam-domain.role.entity';
import { DomainRoleView, DomainView } from '@rey-one/shared';

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
}
