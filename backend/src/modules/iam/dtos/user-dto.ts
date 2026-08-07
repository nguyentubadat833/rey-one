import { createZodDto } from 'nestjs-zod';
import { CreateUserSchema, UpdateUserSchema, UserMemberSchema } from '@rey-one/shared';

export class UserMemberDto extends createZodDto(UserMemberSchema){}
export class CreateUserDto extends createZodDto(CreateUserSchema) { }
export class UpdateUserDto extends createZodDto(UpdateUserSchema) { }