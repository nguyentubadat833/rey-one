import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBasicAuth, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@/modules/iam/guard/auth-guard';
import { AppPermission } from '@rey-one/shared';
import { PermissionGuard } from '@/modules/iam/guard/permission-guard';
import { MarkRequireTenant, MarkRequirePermission } from './utils.decorator';
import { AdminGuard } from '@/modules/iam/guard/admin-guard';
// import { TenantGuard } from '@/modules/iam/guard/tenant-guard';
import { TenantRequirement } from '../types/tokens';

// export const RequireAuth = () => applyDecorators(UseGuards(AuthGuard), ApiBearerAuth(), ApiBasicAuth());
export const RequireAuth = () => applyDecorators(ApiBearerAuth(), ApiBasicAuth());
export const RequireAdmin = () => applyDecorators(UseGuards(AdminGuard));

export const RequirePermission = (permission: AppPermission, requireTenant = true) =>
  applyDecorators(
    UseGuards(PermissionGuard),
    MarkRequirePermission(permission),
    ...(requireTenant ? [MarkRequireTenant(TenantRequirement.REQUIRED)] : []),
  );

export const RequireAuthAndPermission = (permission: AppPermission) =>
  applyDecorators(UseGuards(AuthGuard, PermissionGuard), MarkRequirePermission(permission), ApiBearerAuth(), ApiBasicAuth());

// export const RequireTenant = () => applyDecorators(UseGuards(TenantGuard), MarkRequireTenant(TenantRequirement.REQUIRED));
export const SkipTenant = () => applyDecorators(MarkRequireTenant(TenantRequirement.SKIP));

// export const RequireAuthAndUser = () => applyDecorators(UseGuards(AuthGuard, RequireAdminGuard), ApiBearerAuth(), ApiBasicAuth());
