import { createZodDto } from 'nestjs-zod';
import { CreateUserSchema, UpdateUserSchema } from '@rey-one/shared';

export class CreateUserDto extends createZodDto(CreateUserSchema) { }
export class UpdateUserDto extends createZodDto(UpdateUserSchema) { }