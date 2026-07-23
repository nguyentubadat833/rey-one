import { authConfig } from '@/configs/auth.config';
import { AppError } from '@/utils/errors/app.error';
import { UserAuth } from '@/utils/types/system';
import { REQUEST_USER_KEY, REQUIRE_PERMISSION_KEY } from '@/utils/types/tokens';
import { DOMAIN_ID_PARAMETER, DOMAIN_ID_HEADER } from '@/utils/types/utils';
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException, Inject, BadRequestException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AppPermission, hasPermission } from '@rey-one/shared';
import { FastifyRequest } from 'fastify';
import type { ConfigType } from '@nestjs/config';

@Injectable()
export class RequirePermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(authConfig.KEY) private readonly config: ConfigType<typeof authConfig>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.getAllAndOverride<AppPermission>(REQUIRE_PERMISSION_KEY, [context.getHandler(), context.getClass()]);

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

    const user = request[REQUEST_USER_KEY] as UserAuth;

    if (!user) {
      throw new UnauthorizedException();
    }

    if (user.type === 'admin_user') {
      return true;
    }

    const domainId = request.params.domainId ?? request.query.domainId ?? request.headers['x-domain-id'];

    if (!domainId) {
      throw new BadRequestException('Domain ID is required');
    }

    if (!user.domainAccess[domainId] || !hasPermission(user.domainAccess[domainId], requiredPermission)) {
      throw new ForbiddenException(new AppError('INSUFFICIENT_PERMISSION'));
    }

    return true;
  }
}
