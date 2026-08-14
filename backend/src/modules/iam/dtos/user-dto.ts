import { createZodDto } from 'nestjs-zod';
import { createPaginatedResponseSchema, CreateUserSchema, UpdateUserSchema, UserDetailSchema, UserSchema, UserSummarySchema } from '@rey-one/shared';

export class CreateUserDto extends createZodDto(CreateUserSchema) { }
export class UpdateUserDto extends createZodDto(UpdateUserSchema) { }

export class UserDetailDto extends createZodDto(UserDetailSchema){}

export class UserSummaryDto extends createZodDto(UserSummarySchema) {}
export class UserSummariesDto extends createZodDto(createPaginatedResponseSchema(UserSchema)){}