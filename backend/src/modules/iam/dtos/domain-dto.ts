import {
  CreateDomainSchema,
  CreateDomainUserSchema,
  DomainAvailableSchema,
  DomainSchema,
  DomainSummarySchema,
  DomainUserSchema,
  UpdateDomainSchema,
  UpdateDomainUserSchema,
} from '@rey-one/shared';
import { createZodDto } from 'nestjs-zod';

export class CreateDomainDto extends createZodDto(CreateDomainSchema) {}
export class UpdateDomainDto extends createZodDto(UpdateDomainSchema) {}

export class DomainDto extends createZodDto(DomainSchema) {}
export class DomainSummaryDto extends createZodDto(DomainSummarySchema) {}

export class CreateDomainMemberDto extends createZodDto(CreateDomainUserSchema) {}
export class UpdateDomainMemberDto extends createZodDto(UpdateDomainUserSchema) {}

export class DomainUserDto extends createZodDto(DomainUserSchema) {}
export class DomainAvailableDto extends createZodDto(DomainAvailableSchema) {}
