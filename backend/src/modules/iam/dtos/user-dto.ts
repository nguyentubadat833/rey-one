import { createZodDto } from 'nestjs-zod';
import { createPaginatedResponseSchema, CreateUserSchema, UpdateUserSchema, UserSchema} from '@rey-one/shared';

export class CreateUserDto extends createZodDto(CreateUserSchema) { }
export class UpdateUserDto extends createZodDto(UpdateUserSchema) { }

export class UserDetailDto extends createZodDto(UserSchema){}

export class UserSummaryDto extends createZodDto(UserSchema) {}
export class UserSummariesDto extends createZodDto(createPaginatedResponseSchema(UserSchema)){}