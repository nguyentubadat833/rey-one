import { Domain } from '@/persistence/entities/iam-domain.entity';
import { DomainView } from '@rey-one/shared';

export class DomainMapper {
  static toDomainView(domain: Domain) {
    return {
      id: domain.id,
      name: domain.name,
      active: domain.active,
      permissions: domain.permissions,
    } satisfies DomainView;
  }
}
