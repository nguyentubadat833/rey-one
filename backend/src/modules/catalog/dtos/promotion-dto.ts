import { CreatePromotionSchema } from '@rey-one/shared';
import { createZodDto } from 'nestjs-zod';

export class CreatePromotionDto extends createZodDto(CreatePromotionSchema) {}
