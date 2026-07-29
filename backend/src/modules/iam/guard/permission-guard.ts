import { AppError } from '@/utils/errors/app.error';
import { UserAuth } from '@/utils/types/system';
import { AUTH_METADATA } from '@/utils/types/tokens';
import { DOMAIN_ID_PARAMETER, DOMAIN_ID_HEADER } from '@/utils/types/utils';
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AppPermission, hasPermission } from '@rey-one/shared';
import { FastifyRequest } from 'fastify';
import { Domain } from '@/persistence/entities/iam-domain.entity';
import { DomainCache } from '@/utils/cache/domain-cache';

@Injectable()
export class RequirePermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly domainCache: DomainCache,
    // @Inject(authConfig.KEY) private readonly config: ConfigType<typeof authConfig>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.getAllAndOverride<AppPermission>(AUTH_METADATA.REQUIRE_PERMISSION, [context.getHandler(), context.getClass()]);
    const requiredDomainActive = this.reflector.getAllAndOverride<boolean>(AUTH_METADATA.REQUIRE_DOAMIN_ACTIVE, [context.getHandler(), context.getClass()]);

    if (!requiredPermission) return true;

    const request = context.switchToHttp().getRequest<
      FastifyRequest<{
        Params: {
          [DOMAIN_ID_PARAMETER]?: string;
        };
        Querystring: {
          [DOMAIN_ID_PARAMETER]?: string;
        };
        Headers: {
          [DOMAIN_ID_HEADER]?: string;
        };
      }>
    >();

    const user = request[AUTH_METADATA.USER] as UserAuth;

    if (!user) {
      throw new UnauthorizedException();
    }

    if (user.type === 'admin_user') {
      return true;
    }

    const domainId = request.params.domainId ?? request.query.domainId ?? request.headers[DOMAIN_ID_HEADER];

    if (!domainId) {
      throw new BadRequestException('Domain is required');
    }

    if (requiredDomainActive) {
      const domainStatus = await this.domainCache.getDomainStatusValue(domainId)
      Domain.ensureStatusValue(domainStatus);
    }

    if (!user.domainAccess[domainId] || !hasPermission(user.domainAccess[domainId], requiredPermission)) {
      throw new ForbiddenException(new AppError('INSUFFICIENT_PERMISSION'));
    }

    return true;
  }
}
