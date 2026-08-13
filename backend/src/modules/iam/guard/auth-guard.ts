import { AppClsStore, UserAuth } from '@/utils/types/system';
import { AUTH_METADATA } from '@/utils/types/tokens';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FastifyRequest } from 'fastify';
import { AuthService } from '../services/auth-service';
import { ClsService } from 'nestjs-cls';
import { Reflector } from '@nestjs/core';
import guardHelper from './_helper';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly appStore: ClsService<AppClsStore>,
    private reflector: Reflector,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(AUTH_METADATA.IS_PUBLIC, [context.getHandler(), context.getClass()]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<FastifyRequest>();

    const setData = (userAuth: UserAuth) => {
      request[AUTH_METADATA.USER] = userAuth
      this.appStore.set('actor', userAuth)
    }

    const { extractBasicCredentials, extractBearerToken } = guardHelper();
    const bearerToken = extractBearerToken(request);

    if (bearerToken) {
      const userAuth = await this.verifyBearerToken(bearerToken);
      setData(userAuth)

      return true;
    }

    const basicCredentials = extractBasicCredentials(request);
    if (basicCredentials) {
      const userAuth = await this.authenticateBasic(basicCredentials);
      setData(userAuth)

      return true;
    }

    throw new UnauthorizedException('Missing or invalid authentication credentials');
  }

  private async verifyBearerToken(token: string): Promise<UserAuth> {
    try {
      return await this.jwtService.verifyAsync<UserAuth>(token);
    } catch {
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }

  private async authenticateBasic(credentials: { identity: string; password: string }): Promise<UserAuth> {
    const { user } = await this.authService.baseAuthentication(credentials);

    const role = user.role.getEntity()
    return {
      id: user.id,
      roleId: role.id,
      domainId: role.domain?.getProperty('id'),
      permissions: role.permissions
    } satisfies UserAuth;
  }
}
