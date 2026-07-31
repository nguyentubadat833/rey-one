import { DomainCache } from '@/utils/cache/domain-cache';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import guardHelper from './_helper';
import { DomainRequiredError } from '@/utils/errors/domain.error';
import { Domain } from '@/persistence/entities/iam-domain.entity';
import { AUTH_METADATA, TenantRequirement } from '@/utils/types/tokens';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly domainCache: DomainCache,
    // @Inject(authConfig.KEY) private readonly config: ConfigType<typeof authConfig>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requireTenant = this.reflector.getAllAndOverride<TenantRequirement>(AUTH_METADATA.REQUIRE_TENANT, [context.getHandler(), context.getClass()]);

    if (requireTenant !== TenantRequirement.REQUIRED) return true;

    const request = context.switchToHttp().getRequest();

    const { extractDomainId } = guardHelper();
    const domainId = extractDomainId(request);
    if (!domainId) {
      throw DomainRequiredError();
    }

    const domainStatus = await this.domainCache.getDomainStatusValue(domainId);
    Domain.ensureStatusValue(domainStatus);

    return true;
  }
}
