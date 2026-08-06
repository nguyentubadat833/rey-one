import { createZodDto } from 'nestjs-zod';
import { CreateUserSchema } from '@rey-one/shared';

export class CreateUserDto extends createZodDto(CreateUserSchema) {}
