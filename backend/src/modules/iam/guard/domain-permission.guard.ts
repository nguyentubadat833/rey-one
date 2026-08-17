import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../services/auth-service';
import { DomainService } from '../services/domain-service';
import { DomainPermission } from '@rey-one/shared';
import { AUTH_METADATA } from '@/utils/types/tokens';
import { DomainRequiredError } from '@/utils/errors/domain.error';
import { InvalidUserScopeError } from '@/utils/errors/user.error';
import guardHelper from './_helper';

@Injectable()
export class DomainPermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly authService: AuthService,
    private readonly domainService: DomainService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(AUTH_METADATA.IS_PUBLIC, [context.getHandler(), context.getClass()]);
    if (isPublic) {
      return true
    }

    const requireDomainPermission = this.reflector.getAllAndOverride<DomainPermission>(AUTH_METADATA.REQUIRE_DOMAIN_PERMISSION, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requireDomainPermission) return true;

    const request = context.switchToHttp().getRequest();
    if (this.authService.isActorAdmin()) return true;

    const user = this.authService.getActor();

    const { extractDomainId } = guardHelper();
    const domainId = extractDomainId(request);
    if (!domainId) {
      throw DomainRequiredError();
    }

    const domain = await this.domainService.getDomainById(domainId);
    domain.ensureActive();

    if (user.id === domain.owner.id) return true;
    if (user.scope.type !== 'domain') {
      throw InvalidUserScopeError('Required domain scope');
    }

    if (!user.scope.permissions.includes(requireDomainPermission)) {
      throw new ForbiddenException('Required domain permission: ', requireDomainPermission);
    }
    return true;
  }
}
