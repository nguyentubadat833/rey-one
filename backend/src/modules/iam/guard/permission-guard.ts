import { UserAuth } from '@/utils/types/system';
import { AUTH_METADATA, TenantRequirement } from '@/utils/types/tokens';
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AppPermission, hasPermission } from '@rey-one/shared';
import { AuthService } from '../services/auth-service';
import { DomainService } from '../services/domain-service';
import guardHelper from './_helper';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly authService: AuthService,
    private readonly domainService: DomainService,
    // @Inject(authConfig.KEY) private readonly config: ConfigType<typeof authConfig>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.getAllAndOverride<AppPermission>(AUTH_METADATA.REQUIRE_PERMISSION, [context.getHandler(), context.getClass()]);
    if (!requiredPermission) return true;

    const request = context.switchToHttp().getRequest();

    const user = request[AUTH_METADATA.USER] as UserAuth;
    if (!user) {
      throw new UnauthorizedException();
    }

    if (this.authService.isUserAdmin(user)) return true;

    if (!user.permissions) {
      throw new ForbiddenException('User permissions is required');
    }

    if (!hasPermission(user.permissions, requiredPermission)) {
      throw new ForbiddenException('User missing permission');
    }

    const requireTenant = this.reflector.getAllAndOverride<TenantRequirement>(AUTH_METADATA.REQUIRE_TENANT, [context.getHandler(), context.getClass()]);

    if (requireTenant === TenantRequirement.REQUIRED) {
      const { extractDomainId } = guardHelper();

      const domainId = extractDomainId(request);
      if (!domainId) {
        throw new ForbiddenException('Request domain is required');
      }

      if (!user.domainId) {
        throw new ForbiddenException('User domain is required');
      }

      if (user.domainId !== domainId) {
        throw new ForbiddenException('User domain not assigned');
      }

      const domain = await this.domainService.getDomainById(domainId);
      domain.ensureActive();
    }

    return true;
  }
}
