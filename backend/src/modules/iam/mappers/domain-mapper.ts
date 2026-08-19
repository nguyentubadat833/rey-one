import { DomainAvailableDto, DomainDto, DomainSummaryDto } from '../dtos/domain-dto';
import { DoaminLoadedInfoAndOwner, DomainLoadedInfo, DomainLoadedOwner } from '@/persistence/types/domain-type';
import { AppError } from '@/utils/errors/app.error';

export class DomainMapper {

  private static getOwner(domain: DomainLoadedOwner) {
    if (!domain.owner) throw new AppError('PROPERTY_REQUIRED', "Missing domain owner")
    if (!domain.owner.email) throw new AppError('PROPERTY_REQUIRED', "Domain owner missing email")

    return domain.owner
  }

  static domainToDomainAvailableDto(domain: DomainLoadedInfo){
    return {
      id: domain.id,
      name: domain.info.name,
      image: domain.info.image ?? undefined
    } satisfies DomainAvailableDto
  }

  static domainToDomainSummary(domain: DoaminLoadedInfoAndOwner) {
    const owner = DomainMapper.getOwner(domain)

    return {
      id: domain.id,
      name: domain.info.name,
      plan: domain.subscription.plan,
      startedAt: domain.subscription.startedAt.toISOString(),
      expiresAt: domain.subscription.expiresAt?.toISOString(),
      status: domain.getStatus(),
      owner: {
        email: owner.email!,
        status: owner.status
      }
    } satisfies DomainSummaryDto;
  }

  static toDomain(domain: DoaminLoadedInfoAndOwner) {
    const owner = DomainMapper.getOwner(domain)

    return {
      id: domain.id,
      name: domain.info.name,
      status: domain.getStatus(),
      permissions: domain.permissions,
      plan: domain.subscription.plan,
      startedAt: domain.subscription.startedAt.toISOString(),
      expiresAt: domain.subscription.expiresAt?.toISOString(),
      owner: {
        email: owner.email!,
        status: owner.status
      },
    } satisfies DomainDto
  }
}
