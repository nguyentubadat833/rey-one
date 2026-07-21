import { BaseLoginSchema } from '@rey-one/shared';
import { createZodDto } from 'nestjs-zod';

export class BaseLoginDto extends createZodDto(BaseLoginSchema) {}
