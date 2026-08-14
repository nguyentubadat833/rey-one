import { DomainSummaryDto } from '../dtos/domain-dto';
import { DomainLoadedInfo } from '@/persistence/types/domain-type';

export class DomainMapper {
  static domainToDomainSummary(domain: DomainLoadedInfo) {
    return {
      id: domain.id,
      name: domain.info.name,
      plan: domain.subscription.plan,
      startedAt: domain.subscription.startedAt.toISOString(),
      status: domain.getStatus(),
    } satisfies DomainSummaryDto;
  }
}
