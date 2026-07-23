import { createZodDto } from 'nestjs-zod';
import { CreateDomainSchema, UpdateDomainSchema } from '@rey-one/shared';

export class CreateDomainDto extends createZodDto(CreateDomainSchema) {}
export class UpdateDomainDto extends createZodDto(UpdateDomainSchema) {}
