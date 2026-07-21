import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBasicAuth, ApiBearerAuth } from '@nestjs/swagger';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { AuthGuard } from '@/modules/iam/guard/auth-guard';
import { AppPermission } from '@rey-one/shared';
import { RequirePermissionGuard } from '@/modules/iam/guard/permission-guard';
import { REQUIRE_PERMISSION_KEY } from '../types/tokens';
import { UserObject } from '@/persistence/types/user.type';

export const CurrentUser = createParamDecorator((data: keyof UserObject, ctx: ExecutionContext) => {
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

export const RequireAuth = () => applyDecorators(UseGuards(AuthGuard), ApiBearerAuth(), ApiBasicAuth());
export const RequirePermission = (permission: AppPermission) =>
  applyDecorators(UseGuards(RequirePermissionGuard), SetMetadata(REQUIRE_PERMISSION_KEY, permission));
export const RequireAuthAndPermission = (permission: AppPermission) =>
  applyDecorators(UseGuards(AuthGuard, RequirePermissionGuard), SetMetadata(REQUIRE_PERMISSION_KEY, permission), ApiBearerAuth(), ApiBasicAuth());