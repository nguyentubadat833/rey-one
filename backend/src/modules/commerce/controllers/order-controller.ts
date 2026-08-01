import { RequireAuth, RequirePermission, RequireTenant } from '@/utils/decorators/auth.decorator';
import { ApiDomainHeader } from '@/utils/decorators/utils.decorator';
import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrderService } from '../services/order-service';
import { CreateOrderDto, CreateOrderQueryDto, UpdateOrderDto } from '../dtos/order-dto';
import { OrderMapper } from '../mappers/order-mapper';
import { EntityManager } from '@mikro-orm/core';
import { Order } from '@/persistence/entities/commerce-order.entity';
import { OrderNotFoundError } from '@/utils/errors/order.error';

@RequireAuth()
@RequireTenant()
@ApiDomainHeader()
@ApiTags('Commerce / Orders')
@Controller('orders')
export class OrderController {
  constructor(
    private readonly em: EntityManager,
    private readonly orderService: OrderService
  ) { }

  @RequirePermission('order:manage')
  @Post()
  async createOrder(@Query() query: CreateOrderQueryDto, @Body() dto: CreateOrderDto) {
    const order = await this.orderService.createOrder(query.paymentType, dto);
    return OrderMapper.toOrderView(order);
  }

  @RequirePermission('order:manage')
  @Patch(':orderId')
  async updateOrder(@Param('orderId') orderId: string, dto: UpdateOrderDto) {
    const order = await this.orderService.updateOrder(orderId, dto);
    return OrderMapper.toOrderView(order);
  }

  @RequirePermission('order:read')
  @Get(':orderId')
  async getOrder(@Param('orderId') orderId) {
    return await this.em.findOneOrFail(Order,
      {
        id: orderId
      },
      {
        failHandler: OrderNotFoundError,
        populate: ['customer', 'createdBy.party', 'items.product.info']
      }
    ).then(OrderMapper.toOrderView)
  }
}
