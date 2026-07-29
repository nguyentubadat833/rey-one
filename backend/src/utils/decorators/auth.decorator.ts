import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBasicAuth, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@/modules/iam/guard/auth-guard';
import { AppPermission } from '@rey-one/shared';
import { RequirePermissionGuard } from '@/modules/iam/guard/permission-guard';
import { MarkRequireDomainActive, MarkRequirePermission } from './utils.decorator';
import { RequireAdminGuard } from '@/modules/iam/guard/admin-guard';

// export const RequireAuth = () => applyDecorators(UseGuards(AuthGuard), ApiBearerAuth(), ApiBasicAuth());
export const RequireAuth = () => applyDecorators(ApiBearerAuth(), ApiBasicAuth());

export const RequireAdmin = () => applyDecorators(UseGuards(RequireAdminGuard));

export const RequirePermission = (permission: AppPermission, requireDomainActive = true) =>
  applyDecorators(UseGuards(RequirePermissionGuard), MarkRequirePermission(permission), ...(requireDomainActive ? [MarkRequireDomainActive()] : []));
// export const RequirePermission = (permission: AppPermission, requireDomain = true) =>
//   applyDecorators(UseGuards(RequirePermissionGuard), MarkPermission(permission), ...(requireDomain ? [MarkDomain()] : []));

export const RequireAuthAndPermission = (permission: AppPermission) =>
  applyDecorators(UseGuards(AuthGuard, RequirePermissionGuard), MarkRequirePermission(permission), ApiBearerAuth(), ApiBasicAuth());
export const RequireAuthAndUser = () => applyDecorators(UseGuards(AuthGuard, RequireAdminGuard), ApiBearerAuth(), ApiBasicAuth());
