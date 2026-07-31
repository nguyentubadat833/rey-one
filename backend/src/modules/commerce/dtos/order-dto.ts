import { AddOrderItemSchema, CreateOrderSchema, UpdateOrderSchema } from '@rey-one/shared';
import { createZodDto } from 'nestjs-zod';

export class AddOrderItemsDto extends createZodDto(AddOrderItemSchema){}

export class CreateOrderDto extends createZodDto(CreateOrderSchema) {}
export class UpdateOrderDto extends createZodDto(UpdateOrderSchema) {}
