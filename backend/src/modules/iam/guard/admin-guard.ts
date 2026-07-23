import { authConfig } from '@/configs/auth.config';
import { UserAuth } from '@/utils/types/system';
import { REQUEST_USER_KEY } from '@/utils/types/tokens';
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException, Inject } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';

@Injectable()
export class RequireAdminGuard implements CanActivate {
  constructor(@Inject(authConfig.KEY) private readonly config: ConfigType<typeof authConfig>) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request[REQUEST_USER_KEY] as UserAuth;

    if (!user) {
      throw new UnauthorizedException();
    }

    if (user.type === 'admin_user') {
      return true;
    }

    throw new ForbiddenException();
  }
}
