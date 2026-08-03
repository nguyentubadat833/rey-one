import { createZodDto } from 'nestjs-zod';
import { PaginationQuerySchema } from '@rey-one/shared';

export class PaginationQueryDto extends createZodDto(PaginationQuerySchema) {}
