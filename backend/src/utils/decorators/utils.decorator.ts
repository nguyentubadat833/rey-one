import { applyDecorators, createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY, REQUIRE_PERMISSION_KEY } from '../types/tokens';
import { AppPermission } from '@rey-one/shared';
import { ApiHeader } from '@nestjs/swagger';
import { DOMAIN_ID_HEADER } from '../types/utils';
import { FastifyRequest } from 'fastify';
import { UserAuth } from '../types/system';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
export const Permission = (permission: AppPermission) => SetMetadata(REQUIRE_PERMISSION_KEY, permission);

export function ApiDomainHeader(required = true) {
  return applyDecorators(
    ApiHeader({
      name: DOMAIN_ID_HEADER,
      required,
      description: 'Domain ID',
    }),
  );
}

export const CurrentUser = createParamDecorator((data: keyof UserAuth, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user;

  return data ? user?.[data] : user;
});

export const CurrentCookie = createParamDecorator((key: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<FastifyRequest>();
  return key ? request.cookies[key] : request.cookies;
});

export const CurrentHeader = createParamDecorator((key: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<FastifyRequest>();
  return key ? request.headers[key] : request.headers;
});
