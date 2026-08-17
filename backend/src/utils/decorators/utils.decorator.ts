import { applyDecorators, createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import { AUTH_METADATA } from '../types/tokens';
import { ApiHeader } from '@nestjs/swagger';
import { DOMAIN_ID_HEADER } from '../types/utils';
import { FastifyRequest } from 'fastify';
import { UserAuth } from '../types/system';

export const MarkPublic = () => SetMetadata(AUTH_METADATA.IS_PUBLIC, true);
// export const MarkRequireTenant = (tenant: TenantRequirement) => SetMetadata(AUTH_METADATA.REQUIRE_TENANT, tenant); // Require domain is active
// export const MarkRequirePermission = (permission: AppPermission) => SetMetadata(AUTH_METADATA.REQUIRE_PERMISSION, permission);

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
