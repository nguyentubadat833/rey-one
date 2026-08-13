import { UserAuth } from '@/utils/types/system';
import { AUTH_METADATA } from '@/utils/types/tokens';
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { AuthService } from '../services/auth-service';

@Injectable()
export class AdminGuard implements CanActivate {

   constructor(
      private readonly authService: AuthService
    ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request[AUTH_METADATA.USER] as UserAuth;

    if (!user)  throw new UnauthorizedException();
    if (this.authService.isUserAdmin(user)) return true

    throw new ForbiddenException();
  }
}
