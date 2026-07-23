import { createZodDto } from 'nestjs-zod';
import { CreateDomainRoleSchema, CreateDomainSchema, UpdateDomainRoleSchema, UpdateDomainSchema } from '@rey-one/shared';

export class CreateDomainDto extends createZodDto(CreateDomainSchema) {}
export class UpdateDomainDto extends createZodDto(UpdateDomainSchema) {}

export class CreateDomainRoleDto extends createZodDto(CreateDomainRoleSchema) {}
export class UpdateDomainRoleDto extends createZodDto(UpdateDomainRoleSchema) {}
