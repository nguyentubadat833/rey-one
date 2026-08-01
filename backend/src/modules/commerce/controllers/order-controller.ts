import { RequireAuth, RequirePermission, RequireTenant } from '@/utils/decorators/auth.decorator';
import { ApiDomainHeader } from '@/utils/decorators/utils.decorator';
import { BadRequestException, Body, Controller, Post, Query } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateOrderQuerySchema, ORDER_PAYMENT_TYPES } from '@rey-one/shared';
import { OrderService } from '../services/order-service';
import { CreateOrderDto } from '../dtos/order-dto';
import { OrderMapper } from '../mappers/order-mapper';
import {OrderPaymentType} from '@rey-one/shared'

@RequireAuth()
@RequireTenant()
@ApiDomainHeader()
@ApiTags('Commerce / Orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @RequirePermission('order:manage')
  @ApiQuery({
    name: "paymentType",
    enum: ORDER_PAYMENT_TYPES
  })
  @Post()
  async createOrder(@Query() queries: unknown, @Body() dto: CreateOrderDto) {
    console.log
    const parse = CreateOrderQuerySchema.safeParse(queries);
    if (!parse.success) {
      throw new BadRequestException(parse.error.issues[0].message);
    }

    const { paymentType } = parse.data;
    const order = await this.orderService.createOrder(paymentType, dto);
    return OrderMapper.toOrderView(order);
  }
}
