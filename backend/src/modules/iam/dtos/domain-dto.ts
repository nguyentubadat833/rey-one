// import { createZodDto } from 'nestjs-zod';
// import {
//   CreateDomainMemberSchema,
//   CreateDomainRoleSchema,
//   CreateDomainSchema,
//   UpdateDomainMemberSchema,
//   UpdateDomainRoleSchema,
//   UpdateDomainSchema,
// } from '@rey-one/shared';

import { Domain } from "@/persistence/entities/domain.entity";
import { DomainSummarySchema } from "@rey-one/shared";
import { createZodDto } from "nestjs-zod";

// export class CreateDomainDto extends createZodDto(CreateDomainSchema) {}
// export class UpdateDomainDto extends createZodDto(UpdateDomainSchema) {}

// export class CreateDomainRoleDto extends createZodDto(CreateDomainRoleSchema) {}
// export class UpdateDomainRoleDto extends createZodDto(UpdateDomainRoleSchema) {}

// export class CreateDomainMemberDto extends createZodDto(CreateDomainMemberSchema) {}
// export class UpdateDomainMemberDto extends createZodDto(UpdateDomainMemberSchema) {}

export class DomainSummaryDto extends createZodDto(DomainSummarySchema){}