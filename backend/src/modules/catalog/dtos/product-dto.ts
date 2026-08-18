import { CreateProductSchema, ProductSchema, UpdateProductSchema, ProductSummarySchema } from '@rey-one/shared';
import { createZodDto } from 'nestjs-zod';

export class CreateProductDto extends createZodDto(CreateProductSchema) {}
export class UpdateProductDto extends createZodDto(UpdateProductSchema) {}

export class ProductDto extends createZodDto(ProductSchema){}

export class ProductSummaryDto extends createZodDto(ProductSummarySchema){}