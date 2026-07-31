import { UserAuth } from '@/utils/types/system';
import { AUTH_METADATA } from '@/utils/types/tokens';
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request[AUTH_METADATA.USER] as UserAuth;

    if (!user)  throw new UnauthorizedException();
    if (user.type === 'admin_user') return true

    throw new ForbiddenException();
  }
}
