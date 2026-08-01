import { AppClsStore, UserAuth } from '@/utils/types/system';
import { AUTH_METADATA } from '@/utils/types/tokens';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserType } from '@rey-one/shared';
import { FastifyRequest } from 'fastify';
import { AuthService } from '../services/auth-service';
import guardHelper from './_helper';
import { ClsService } from 'nestjs-cls';
import { Reflector } from '@nestjs/core';

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

  // private extractBearerToken(request: FastifyRequest): string | undefined {
  //   const fromCookie = request.cookies?.['access_token'];
  //   if (fromCookie) return fromCookie;

  //   const authHeader = request.headers.authorization;
  //   if (authHeader?.startsWith('Bearer ')) {
  //     return authHeader.slice('Bearer '.length);
  //   }

  //   return undefined;
  // }

  private async verifyBearerToken(token: string): Promise<UserAuth> {
    try {
      return await this.jwtService.verifyAsync<UserAuth>(token);
    } catch {
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }

  // private extractBasicCredentials(request: FastifyRequest): { identity: string; password: string } | undefined {
  //   const authHeader = request.headers.authorization;
  //   if (!authHeader?.startsWith('Basic ')) return undefined;

  //   const decoded = Buffer.from(authHeader.slice('Basic '.length), 'base64').toString();
  //   const separatorIndex = decoded.indexOf(':');
  //   if (separatorIndex === -1) return undefined;

  //   return {
  //     identity: decoded.slice(0, separatorIndex),
  //     password: decoded.slice(separatorIndex + 1),
  //   };
  // }

  private async authenticateBasic(credentials: { identity: string; password: string }): Promise<UserAuth> {
    const { user } = await this.authService.baseAuthentication(credentials);

    return {
      id: user.id,
      type: user.type as UserType,
      domainAccess: await user.loadDomainAccess(),
    } satisfies UserAuth;
  }

  // async canActivate(context: ExecutionContext): Promise<boolean> {
  // const isPublic = this.reflector.getAllAndOverride<boolean>(AUTH_METADATA.IS_PUBLIC, [context.getHandler(), context.getClass()]);
  // if (isPublic) {
  //   return true;
  // }

  //   const request = context.switchToHttp().getRequest<FastifyRequest>();
  //   const accessTokenFromCookie = request.cookies?.['access_token'];
  //   const authHeader = request.headers.authorization

  //   if (accessTokenFromCookie || authHeader?.startsWith('Bearer ')) {
  //     const accessToken = accessTokenFromCookie ?? authHeader!.replace('Bearer ', '');

  //     const user: UserAuth = await this.jwtService.verifyAsync(accessToken);
  //     request[AUTH_METADATA.USER] = user;

  //     return true;
  //   }

  //   if (authHeader?.startsWith('Basic ')) {
  //     const [identity, password] = Buffer.from(authHeader.slice(6), 'base64').toString().split(':');

  //     const { user } = await this.authService.baseAuthentication({ identity, password });

  //     request[AUTH_METADATA.USER] = {
  //       id: user.id,
  //       type: user.type as UserType,
  //       domainAccess: await user.loadDomainAccess(),
  //     } satisfies UserAuth;

  //     return true;
  //   }

  //   throw new UnauthorizedException();
  // }
}
