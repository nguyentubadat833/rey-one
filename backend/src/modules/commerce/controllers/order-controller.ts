// import { RequireAuth, RequirePermission, RequireTenant } from '@/utils/decorators/auth.decorator';
// import { ApiDomainHeader } from '@/utils/decorators/utils.decorator';
// import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
// import { ApiOperation, ApiTags } from '@nestjs/swagger';
// import { OrderService } from '../services/order-service';
// import { CreateOrderDto, CreateOrderQueryDto, UpdateOrderDto } from '../dtos/order-dto';
// import { OrderMapper } from '../mappers/order-mapper';
// import { EntityManager } from '@mikro-orm/core';
// import { Order } from '@/persistence/entities/order.entity';
// import { OrderNotFoundError } from '@/utils/errors/order.error';
// import { PaginationQueryDto } from '@/utils/dtos/utils-dto';
// import { ResponseMapper } from '@/utils/mappers/response-mapper';

// @RequireAuth()
// @RequireTenant()
// @ApiDomainHeader()
// @ApiTags('Commerce / Orders')
// @Controller('orders')
// export class OrderController {
//   constructor(
//     private readonly em: EntityManager,
//     private readonly orderService: OrderService,
//   ) {}

//   @RequirePermission('order:read', false)
//   @ApiOperation({ summary: 'Orders summaries' })
//   @Get()
//   async summaries(@Query() { limit, page }: PaginationQueryDto) {
//     const [data, total] = await this.em.findAndCount(
//       Order,
//       {},
//       {
//         populate: ['customer', 'createdBy.party'],
//         limit,
//         offset: (page - 1) * limit,
//         orderBy: [
//           {
//             createdAt: 'DESC',
//           },
//         ],
//       },
//     );

//     const orders = data.map((item) => OrderMapper.toOrderSummaryView(item));
//     return ResponseMapper.toPaginatedResponse(orders, total, page, limit);
//   }

//   @ApiOperation({ summary: 'Create order' })
//   @RequirePermission('order:manage', true)
//   @Post()
//   async createOrder(@Query() query: CreateOrderQueryDto, @Body() dto: CreateOrderDto) {
//     const order = await this.orderService.createOrder(query.paymentType, dto);
//     return OrderMapper.toOrderView(order);
//   }

//   @ApiOperation({ summary: 'Update order' })
//   @RequirePermission('order:manage', true)
//   @Patch(':orderId')
//   async updateOrder(@Param('orderId') orderId: string, dto: UpdateOrderDto) {
//     const order = await this.orderService.updateOrder(orderId, dto);
//     return OrderMapper.toOrderView(order);
//   }

//   @ApiOperation({ summary: 'Get order' })
//   @RequirePermission('order:read')
//   @Get(':orderId')
//   async getOrder(@Param('orderId') orderId: string) {
//     return await this.em
//       .findOneOrFail(
//         Order,
//         {
//           id: orderId,
//         },
//         {
//           failHandler: OrderNotFoundError,
//           populate: ['customer', 'createdBy.party', 'items.product.info'],
//         },
//       )
//       .then(OrderMapper.toOrderView);
//   }
// }
