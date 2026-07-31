import { RequireAuth, RequireTenant, SkipTenant } from '@/utils/decorators/auth.decorator';
import { ApiDomainHeader } from '@/utils/decorators/utils.decorator';
import { Controller, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { OrderPaymentType } from '@rey-one/shared';

@RequireAuth()
@RequireTenant()
@ApiDomainHeader()
@ApiTags('Commerce / Orders')
@Controller('orders')
export class OrderController {
  constructor() {}

  @Post()
  createOrder(@Query('paymentType') paymentType: OrderPaymentType) {
    
  }
}
