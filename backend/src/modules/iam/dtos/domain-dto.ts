import { CreateDomainSchema, DomainSchema, DomainSummarySchema, UpdateDomainSchema } from "@rey-one/shared";
import { createZodDto } from "nestjs-zod";

export class CreateDomainDto extends createZodDto(CreateDomainSchema) { }
export class UpdateDomainDto extends createZodDto(UpdateDomainSchema) { }

export class DomainDto extends createZodDto(DomainSchema) { }
export class DomainSummaryDto extends createZodDto(DomainSummarySchema) { }