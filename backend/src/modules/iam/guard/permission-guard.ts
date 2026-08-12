import { AppError } from '@/utils/errors/app.error';
import { UserAuth } from '@/utils/types/system';
import { AUTH_METADATA, TenantRequirement } from '@/utils/types/tokens';
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AppPermission, hasPermission } from '@rey-one/shared';
import { DomainCache } from '@/utils/cache/domain-cache';
import guardHelper from './_helper';
import { DomainRequiredError } from '@/utils/errors/domain.error';
import { Domain } from '@/persistence/entities/domain.entity';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly domainCache: DomainCache,
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
    if (user.type === 'admin_user') {
      return true;
    }

    const { extractDomainId } = guardHelper();
    const domainId = extractDomainId(request);
    if (!domainId) {
      throw DomainRequiredError();
    }

    const requireTenant = this.reflector.getAllAndOverride<TenantRequirement>(AUTH_METADATA.REQUIRE_TENANT, [context.getHandler(), context.getClass()]);

    if (requireTenant === TenantRequirement.REQUIRED) {
      const domainStatus = await this.domainCache.getDomainStatusValue(domainId);
      Domain.ensureStatusValue(domainStatus);
    }

    this.ensurePermission(user, domainId, requiredPermission);
    return true;
  }

  private ensurePermission(user: UserAuth, domainId: string, requiredPermission: AppPermission): void {
    const access = user.domainAccess[domainId];

    if (!access || !hasPermission(access, requiredPermission)) {
      throw new ForbiddenException(new AppError('INSUFFICIENT_PERMISSION'));
    }
  }

  // async canActivate(context: ExecutionContext): Promise<boolean> {
  //   const requiredPermission = this.reflector.getAllAndOverride<AppPermission>(AUTH_METADATA.REQUIRE_PERMISSION, [context.getHandler(), context.getClass()]);
  //   const requiredDomainActive = this.reflector.getAllAndOverride<boolean>(AUTH_METADATA.REQUIRE_DOAMIN_ACTIVE, [context.getHandler(), context.getClass()]);

  //   if (!requiredPermission) return true;

  // const request = context.switchToHttp().getRequest<
  //   FastifyRequest<{
  //     Params: {
  //       [DOMAIN_ID_PARAMETER]?: string;
  //     };
  //     Querystring: {
  //       [DOMAIN_ID_PARAMETER]?: string;
  //     };
  //     Headers: {
  //       [DOMAIN_ID_HEADER]?: string;
  //     };
  //   }>
  // >();

  //   const user = request[AUTH_METADATA.USER] as UserAuth;

  //   if (!user) {
  //     throw new UnauthorizedException();
  //   }

  //   if (user.type === 'admin_user') {
  //     return true;
  //   }

  //   const domainId = request.headers['x-domain-id'] ?? request.params.domainId ?? request.query.domainId;

  //   if (!domainId) {
  //     throw new BadRequestException('Domain is required');
  //   }

  //   if (requiredDomainActive) {
  //     const domainStatus = await this.domainCache.getDomainStatusValue(domainId);
  //     Domain.ensureStatusValue(domainStatus);
  //   }

  //   if (!user.domainAccess[domainId] || !hasPermission(user.domainAccess[domainId], requiredPermission)) {
  //     throw new ForbiddenException(new AppError('INSUFFICIENT_PERMISSION'));
  //   }

  //   return true;
  // }
}
