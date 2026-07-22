import { SetMetadata } from "@nestjs/common";
import { IS_PUBLIC_KEY, REQUIRE_PERMISSION_KEY } from "../types/tokens";
import { AppPermission } from "@rey-one/shared";

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
export const Permission = (permission: AppPermission) => SetMetadata(REQUIRE_PERMISSION_KEY, permission)