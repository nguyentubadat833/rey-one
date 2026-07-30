import { CreateOrderSchema, UpdateOrderSchema } from '@rey-one/shared';
import { createZodDto } from 'nestjs-zod';

export class CreateOrderDto extends createZodDto(CreateOrderSchema) {}
export class UpdateOrderDto extends createZodDto(UpdateOrderSchema) {}
