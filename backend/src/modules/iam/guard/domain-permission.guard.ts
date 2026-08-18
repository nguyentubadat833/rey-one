import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DomainPermission } from '@rey-one/shared';
import { AUTH_METADATA, TOKENS } from '@/utils/types/tokens';
import { DomainRequiredError } from '@/utils/errors/domain.error';
import { InvalidUserScopeError } from '@/utils/errors/user.error';
import type { AuthUtils, DomainUtils } from '@/modules/contracts';
import guardHelper from './_helper';

@Injectable()
export class DomainPermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(TOKENS.AUTH_UTILS) private readonly authService: AuthUtils,
    @Inject(TOKENS.DOMAIN_UTILS) private readonly domainService: DomainUtils,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(AUTH_METADATA.IS_PUBLIC, [context.getHandler(), context.getClass()]);
    if (isPublic) {
      return true;
    }

    const requireDomainPermission = this.reflector.getAllAndOverride<DomainPermission>(AUTH_METADATA.REQUIRE_DOMAIN_PERMISSION, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requireDomainPermission) return true;

    const isForceDomainActive = this.reflector.getAllAndOverride<boolean>(AUTH_METADATA.IS_FORCE_DOMAIN_ACTIVE, [context.getHandler(), context.getClass()]);

    const request = context.switchToHttp().getRequest();
    if (this.authService.isActorAdmin()) return true;

    const user = this.authService.getActor();

    const { extractDomainId } = guardHelper();
    const domainId = extractDomainId(request);
    if (!domainId) {
      throw DomainRequiredError();
    }

    const domain = await this.domainService.getDomainById(domainId);
    if (isForceDomainActive) domain.ensureActive();

    if (user.id === domain.owner.id) return true;
    if (user.scope.type !== 'domain') {
      throw InvalidUserScopeError('Required domain scope');
    }

    if (!user.scope.permissions.includes(requireDomainPermission)) {
      throw new ForbiddenException(`Required domain permission: ${requireDomainPermission}`);
    }
    return true;
  }
}
