import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { AuthService } from '../services/auth-service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // const request = context.switchToHttp().getRequest();
    // const user = request[AUTH_METADATA.USER] as UserAuth;

    // if (!user)  throw new UnauthorizedException();
    // if (this.authService.adminUser.roleId === user.roleId) return true

    if (!this.authService.isActorAdmin()) {
      throw new ForbiddenException();
    }
    
    return true
  }
}
