import { AddOrderItemSchema, CreateOrderQuerySchema, CreateOrderSchema, OrderSchema, OrderSummarySchema, UpdateOrderSchema } from '@rey-one/shared';
import { createZodDto } from 'nestjs-zod';

export class AddOrderItemsDto extends createZodDto(AddOrderItemSchema) {}

export class CreateOrderDto extends createZodDto(CreateOrderSchema) {}
export class CreateOrderQueryDto extends createZodDto(CreateOrderQuerySchema) {}
export class UpdateOrderDto extends createZodDto(UpdateOrderSchema) {}

export class OrderDto extends createZodDto(OrderSchema) {}
export class OrderSummaryDto extends createZodDto(OrderSummarySchema) {}
