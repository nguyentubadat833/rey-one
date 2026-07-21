import { authConfig } from '@/configs/auth.config';
import { UserObject } from '@/persistence/entities/iam.user-entity';
import { AppError } from '@/utils/errors/app.error';
import { REQUEST_USER_KEY, REQUIRE_PERMISSION_KEY } from '@/utils/types/tokens';
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException, Inject } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { AppPermission } from '@rey-one/shared';
import { FastifyRequest } from 'fastify';

@Injectable()
export class RequirePermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(authConfig.KEY) private readonly config: ConfigType<typeof authConfig>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.getAllAndOverride<AppPermission>(REQUIRE_PERMISSION_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredPermission) return true;

    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const user = request[REQUEST_USER_KEY] as UserObject;

    if (!user) {
      throw new UnauthorizedException();
    }

    if (user.email === this.config.userDefault.admin.email) {
      return true;
    }

    if (!user.permissions.includes(requiredPermission)) {
      throw new ForbiddenException(new AppError('INSUFFICIENT_PERMISSION'));
    }

    return true;
  }
}
