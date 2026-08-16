import { createZodDto } from 'nestjs-zod';
import { createPaginatedResponseSchema, CreateSystemUserSchema, SystemUserSchema, UpdateSystemUserSchema} from '@rey-one/shared';

export class CreateUserDto extends createZodDto(CreateSystemUserSchema) { }
export class UpdateUserDto extends createZodDto(UpdateSystemUserSchema) { }

export class UserDto extends createZodDto(SystemUserSchema){}

export class UserSummaryDto extends createZodDto(SystemUserSchema) {}
export class UserSummariesDto extends createZodDto(createPaginatedResponseSchema(SystemUserSchema)){}