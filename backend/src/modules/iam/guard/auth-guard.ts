import { UserRepository } from '@/persistence/repositories/user-repository';
import { UserObject } from '@/persistence/types/user.type';
import { IS_PUBLIC_KEY, REQUEST_USER_KEY } from '@/utils/types/tokens';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { FastifyRequest } from 'fastify';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const accessTokenFromCookie = request?.cookies?.['access_token'];
    const authHeader = request?.headers?.['authorization'];

    if (accessTokenFromCookie || authHeader?.startsWith('Bearer ')) {
      const accessToken = accessTokenFromCookie ?? authHeader!.replace('Bearer ', '');

      const user: UserObject = await this.jwtService.verifyAsync(accessToken);
      request[REQUEST_USER_KEY] = user;

      return true;
    }

    if (authHeader?.startsWith('Basic ')) {
      const [email, password] = Buffer.from(authHeader.slice(6), 'base64').toString().split(':');

      const user = await this.userRepo.authenticateByPassword(email, password);
      await this.userRepo.recordSuccessfulAuthentication(user);

      request[REQUEST_USER_KEY] = UserRepository.toObject(user);
      return true;
    }

    throw new UnauthorizedException();
  }
}
