import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBasicAuth, ApiBearerAuth } from '@nestjs/swagger';
import { AdminGuard } from '@/modules/iam/guard/admin.guard';
import { DomainPermission, SystemPermission } from '@rey-one/shared';
import { SystemPermissionGuard } from '@/modules/iam/guard/system-permission.guard';
import { AUTH_METADATA } from '../types/tokens';
import { DomainPermissionGuard } from '@/modules/iam/guard/domain-permission.guard';

// export const RequireAuth = () => applyDecorators(UseGuards(AuthGuard), ApiBearerAuth(), ApiBasicAuth());
export const RequireAuth = () => applyDecorators(ApiBearerAuth(), ApiBasicAuth());
export const RequireAdmin = () => applyDecorators(UseGuards(AdminGuard));

export const RequireSystemPermission = (permission: SystemPermission) =>
  applyDecorators(
    UseGuards(SystemPermissionGuard),
    SetMetadata(AUTH_METADATA.REQUIRE_SYSTEM_PERMISSION, permission)
  );

export const RequireDomainPermission = (permission: DomainPermission, forceDomainActive = false) =>
  applyDecorators(
    UseGuards(DomainPermissionGuard),
    SetMetadata(AUTH_METADATA.REQUIRE_DOMAIN_PERMISSION, permission),
    SetMetadata(AUTH_METADATA.IS_FORCE_DOMAIN_ACTIVE, forceDomainActive)
  );

// export const RequireAuthAndPermission = (permission: AppPermission) =>
//   applyDecorators(UseGuards(AuthGuard, PermissionGuard), MarkRequirePermission(permission), ApiBearerAuth(), ApiBasicAuth());

// export const RequireTenant = () => applyDecorators(UseGuards(TenantGuard), MarkRequireTenant(TenantRequirement.REQUIRED));
// export const SkipTenant = () => applyDecorators(MarkRequireTenant(TenantRequirement.SKIP));

// export const RequireAuthAndUser = () => applyDecorators(UseGuards(AuthGuard, RequireAdminGuard), ApiBearerAuth(), ApiBasicAuth());
