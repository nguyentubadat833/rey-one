import { RequireAuth, RequirePermission, RequireTenant } from '@/utils/decorators/auth.decorator';
import { ApiDomainHeader } from '@/utils/decorators/utils.decorator';
import { Body, Controller, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrderService } from '../services/order-service';
import { CreateOrderDto, CreateOrderQueryDto } from '../dtos/order-dto';
import { OrderMapper } from '../mappers/order-mapper';

@RequireAuth()
@RequireTenant()
@ApiDomainHeader()
@ApiTags('Commerce / Orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @RequirePermission('order:manage')
  @Post()
  async createOrder(@Query() query: CreateOrderQueryDto, @Body() dto: CreateOrderDto) {
    const order = await this.orderService.createOrder(query.paymentType, dto);
    return OrderMapper.toOrderView(order);
  }
}
