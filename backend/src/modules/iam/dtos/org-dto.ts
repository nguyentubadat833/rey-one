import { createZodDto } from 'nestjs-zod';
import { OrganizationInputSchema, OrganizationMemberInputSchema } from '@rey-one/shared';

export class OrgInputDto extends createZodDto(OrganizationInputSchema) {}
export class OrgMemberInputDto extends createZodDto(OrganizationMemberInputSchema) {}
