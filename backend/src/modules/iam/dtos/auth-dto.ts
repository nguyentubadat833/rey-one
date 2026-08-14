import { BaseLoginSchema, UserAuthResponseSchema, UserLoginResponseSchema } from '@rey-one/shared';
import { createZodDto } from 'nestjs-zod';

export class BaseLoginDto extends createZodDto(BaseLoginSchema) {}
export class UserAuthResponseDto extends createZodDto(UserAuthResponseSchema){}
export class UserLoginResponseDto extends createZodDto(UserLoginResponseSchema){}
