import { CreateRoleSchema, RoleSummarySchema, UpdateRoleSchema } from "@rey-one/shared";
import { createZodDto } from "nestjs-zod";

export class CreateRoleDto extends createZodDto(CreateRoleSchema){}
export class UpdateRoleDto extends createZodDto(UpdateRoleSchema){}

export class RoleSummaryDto extends createZodDto(RoleSummarySchema){}