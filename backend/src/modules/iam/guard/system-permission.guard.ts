import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SystemPermission } from '@rey-one/shared';
import { AUTH_METADATA, TOKENS } from '@/utils/types/tokens';
import { InvalidUserScopeError } from '@/utils/errors/user.error';
import type { AuthUtils } from '@/modules/contracts';

@Injectable()
export class SystemPermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(TOKENS.AUTH_UTILS) private readonly authService: AuthUtils,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(AUTH_METADATA.IS_PUBLIC, [context.getHandler(), context.getClass()]);
    if (isPublic) {
      return true
    }

    const requireSystemPermission = this.reflector.getAllAndOverride<SystemPermission>(AUTH_METADATA.REQUIRE_SYSTEM_PERMISSION, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requireSystemPermission) return true;

    if (this.authService.isActorAdmin()) return true;

    const user = this.authService.getActor();

    if (user.scope.type !== 'system') {
      throw InvalidUserScopeError('Required system scope');
    }

    if (!user.scope.permissions.includes(requireSystemPermission)) {
      throw new ForbiddenException('Required system permission: ', requireSystemPermission);
    }
    return true;
  }
}
