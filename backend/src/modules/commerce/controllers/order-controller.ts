import { RequireAuth, RequirePermission, RequireTenant } from '@/utils/decorators/auth.decorator';
import { ApiDomainHeader, CurrentUser } from '@/utils/decorators/utils.decorator';
import { BadRequestException, Controller, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateOrderQuerySchema } from '@rey-one/shared';
import { OrderService } from '../services/order-service';
import { CreateOrderDto } from '../dtos/order-dto';
import { OrderMapper } from '../mappers/order-mapper';

@RequireAuth()
@RequireTenant()
@ApiDomainHeader()
@ApiTags('Commerce / Orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @RequirePermission('order:manage')
  @Post()
  async createOrder(@CurrentUser('id') createdByUserId: string, @Query() queries: unknown, dto: CreateOrderDto) {
    const parse = CreateOrderQuerySchema.safeParse(queries);
    if (!parse.success) {
      throw new BadRequestException(parse.error.issues[0].message);
    }

    const { paymentType } = parse.data;
    const order = await this.orderService.createOrder(paymentType, createdByUserId, dto);
    return OrderMapper.toOrderView(order);
  }
}
