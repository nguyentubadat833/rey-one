import { applyDecorators, SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY, REQUIRE_PERMISSION_KEY } from '../types/tokens';
import { AppPermission } from '@rey-one/shared';
import { ApiHeader } from '@nestjs/swagger';
import { DOMAIN_ID_HEADER } from '../types/utils';

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
