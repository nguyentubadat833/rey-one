import { createZodDto } from 'nestjs-zod';
import { createPaginatedResponseSchema, CreateSystemUserSchema, SystemUserSchema, UpdateSystemUserSchema, UserSummarySchema} from '@rey-one/shared';

export class CreateUserDto extends createZodDto(CreateSystemUserSchema) { }
export class UpdateUserDto extends createZodDto(UpdateSystemUserSchema) { }

export class SystemUserDto extends createZodDto(SystemUserSchema){}

export class UserSummaryDto extends createZodDto(UserSummarySchema) {}
export class UserSummariesDto extends createZodDto(createPaginatedResponseSchema(UserSummarySchema)){}