import { DomainInputSchema, UpdateDomainInputSchema } from '@rey-one/shared';
import { createZodDto } from 'nestjs-zod';

export class DomainInputDto extends createZodDto(DomainInputSchema) {}
export class UpdateDomainInputDto extends createZodDto(UpdateDomainInputSchema) {}
