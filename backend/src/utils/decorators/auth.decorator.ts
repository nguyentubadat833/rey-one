import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBasicAuth, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@/modules/iam/guard/auth-guard';
import { AppPermission } from '@rey-one/shared';
import { RequirePermissionGuard } from '@/modules/iam/guard/permission-guard';
import { Permission } from './utils.decorator';
import { RequireAdminGuard } from '@/modules/iam/guard/admin-guard';

export const RequireAuth = () => applyDecorators(UseGuards(AuthGuard), ApiBearerAuth(), ApiBasicAuth());

export const RequireAdmin = () => applyDecorators(UseGuards(RequireAdminGuard));
export const RequirePermission = (permission: AppPermission) => applyDecorators(UseGuards(RequirePermissionGuard), Permission(permission));

export const RequireAuthAndPermission = (permission: AppPermission) =>
  applyDecorators(UseGuards(AuthGuard, RequirePermissionGuard), Permission(permission), ApiBearerAuth(), ApiBasicAuth());
export const RequireAuthAndUser = () => applyDecorators(UseGuards(AuthGuard, RequireAdminGuard), ApiBearerAuth(), ApiBasicAuth());
