import { RequireAuth, RequireDomainPermission } from '@/utils/decorators/auth.decorator';
import { ApiDomainHeader } from '@/utils/decorators/utils.decorator';
import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrderService } from '../services/order-service';
import { CreateOrderDto, CreateOrderQueryDto, OrderDto, UpdateOrderDto } from '../dtos/order-dto';
import { OrderMapper } from '../mappers/order-mapper';
import { EntityManager } from '@mikro-orm/core';
import { Order } from '@/persistence/entities/order.entity';
import { OrderNotFoundError } from '@/utils/errors/order.error';
import { PaginationQueryDto } from '@/utils/dtos/utils-dto';
import { ResponseMapper } from '@/utils/mappers/response-mapper';
import { createZodDto } from 'nestjs-zod';
import { createPaginatedResponseSchema, OrderSummarySchema } from '@rey-one/shared';

@RequireAuth()
@ApiDomainHeader()
@ApiTags('Commerce / Orders')
@Controller('orders')
export class OrderController {
  constructor(
    private readonly em: EntityManager,
    private readonly orderService: OrderService,
  ) {}

  @RequireDomainPermission('order@read')
  @ApiOperation({ summary: 'Orders summaries' })
  @ApiOkResponse({
    type: createZodDto(createPaginatedResponseSchema(OrderSummarySchema)),
  })
  @Get()
  async summaries(@Query() { limit, page }: PaginationQueryDto) {
    const [data, total] = await this.em.findAndCount(
      Order,
      {},
      {
        populate: ['createdBy.info', 'customer.info'],
        limit,
        offset: (page - 1) * limit,
        orderBy: [
          {
            createdAt: 'DESC',
          },
        ],
      },
    );

    const orders = data.map((item) => OrderMapper.toOrderSummaryDto(item));
    return ResponseMapper.toPaginatedResponse(orders, total, page, limit);
  }

  @RequireDomainPermission('order@read', true)
  @ApiOperation({ summary: 'Create order' })
  @ApiOkResponse({
    type: OrderDto,
  })
  @Post()
  async createOrder(@Query() query: CreateOrderQueryDto, @Body() dto: CreateOrderDto) {
    const order = await this.orderService.createOrder(query.paymentType, dto);
    return OrderMapper.toOrderDto(order);
  }

  @RequireDomainPermission('order@update', true)
  @ApiOperation({ summary: 'Update order' })
  @ApiOkResponse({
    type: OrderDto,
  })
  @Patch(':orderId')
  async updateOrder(@Param('orderId') orderId: string, dto: UpdateOrderDto) {
    const order = await this.orderService.updateOrder(orderId, dto);
    return OrderMapper.toOrderDto(order);
  }

  @RequireDomainPermission('order@read')
  @ApiOperation({ summary: 'Get order' })
  @Get(':orderId')
  async getOrder(@Param('orderId') orderId: string) {
    return await this.em
      .findOneOrFail(
        Order,
        {
          id: orderId,
        },
        {
          failHandler: OrderNotFoundError,
          populate: ['domain', 'createdBy.info', 'customer.info', 'payments'],
        },
      )
      .then(OrderMapper.toOrderDto);
  }
}
