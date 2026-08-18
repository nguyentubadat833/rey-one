import { AppClsStore } from '@/utils/types/system';
import { EntityManager } from '@mikro-orm/core';
import { Inject, Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { AddOrderItemsDto, CreateOrderDto, UpdateOrderDto } from '../dtos/order-dto';
import { Order, OrderItem } from '@/persistence/entities/order.entity';
import { Domain } from '@/persistence/entities/domain.entity';
import { Product } from '@/persistence/entities/product.entity';
import { OrderNotFoundError, OrderPaymentTypeUnsupported } from '@/utils/errors/order.error';
import { CommerceService } from './commerce-service';
import { AppError } from '@/utils/errors/app.error';
import { OrderPaymentType } from '@rey-one/shared';
import { User } from '@/persistence/entities/user.entity';
import { TOKENS } from '@/utils/types/tokens';
import { UserService } from '@/modules/iam/services/user-service';
import { DomainService } from '@/modules/iam/services/domain-service';
import { OrderLoadedDomainAndCustomerAndPayments } from '@/persistence/types/order-type';

@Injectable()
export class OrderService {
  constructor(
    private readonly em: EntityManager,
    private readonly commerceService: CommerceService,
    private readonly clsService: ClsService<AppClsStore>,
    @Inject(TOKENS.USER_UTILS) private readonly userService: UserService,
    @Inject(TOKENS.DOMAIN_UTILS) private readonly domainService: DomainService,
  ) {}

  private getActorIdFromStore() {
    return this.clsService.get('actor.id');
  }

  private async orderItemsFromRequest(order: Order, items: AddOrderItemsDto[]): Promise<OrderItem[]> {
    if (!items.length) {
      throw new AppError('PROPERTY_REQUIRED', 'Order items cannot be empty');
    }

    const productIds = [...new Set(items.map((item) => item.productId))];

    const products = await this.em.find(Product, { id: { $in: productIds } }, { populate: ['info'] });
    if (products.length !== productIds.length) {
      const foundIds = new Set(products.map((product) => product.id));
      const missingIds = productIds.filter((id) => !foundIds.has(id));

      throw new AppError('NOT_FOUND', `The following product(s) were not found: ${missingIds.join(', ')}.`);
    }

    const productById = new Map(products.map((product) => [product.id, product]));
    return items.map((item) => {
      const product = productById.get(item.productId)!;

      this.commerceService.ensureProductSellable(product);
      return this.em.create(OrderItem, {
        order,
        product,
        subtotal: item.subtotal,
        metadata: item.metadata,
      });
    });
  }

  async createOrder(
    paymentType: OrderPaymentType,
    dto: CreateOrderDto,
    domainId = this.domainService.getDomainIdFromContext(),
    actorId: string = this.getActorIdFromStore(),
  ) {
    if (paymentType !== 'one_time') {
      throw OrderPaymentTypeUnsupported(paymentType);
    }

    let customer: User;

    const customerId = dto.customer.id;
    if (customerId) {
      customer = await this.domainService.getDomainUserById(customerId);
      this.commerceService.ensureCustomerCanOrder(customer);
    } else {
      customer = await this.domainService.createCustomer({
        status: 'active',
        name: dto.customer.name,
        permissions: [],
      });
    }

    const order = this.em.create(Order, {
      paymentType: paymentType,
      totalAmount: dto.totalAmount,
      metadata: dto.metadata,
      domain: this.em.getReference(Domain, domainId),
      createdBy: this.em.getReference(User, actorId),
      status: 'draft',
      customer,
    });

    const items = await this.orderItemsFromRequest(order, dto.items);
    order.items.set(items);

    await this.em.flush();
    await this.em.populate(order, ['createdBy']);

    return order as OrderLoadedDomainAndCustomerAndPayments;
  }

  async updateOrder(orderId: string, dto: UpdateOrderDto) {
    const order = await this.em.findOneOrFail(
      Order,
      {
        id: orderId,
      },
      {
        failHandler: OrderNotFoundError,
        populate: ['items.product.info', 'createdBy', 'customer', 'domain', 'payments'],
      },
    );

    this.em.assign(
      order,
      {
        totalAmount: dto.totalAmount,
        metadata: dto.metadata,
      },
      {
        ignoreUndefined: true,
      },
    );

    if (dto.items) {
      const items = await this.orderItemsFromRequest(order, dto.items);
      order.items.set(items);
    }

    await this.em.flush();
    return order as OrderLoadedDomainAndCustomerAndPayments;
  }

  async getOrderById(id: string): Promise<OrderLoadedDomainAndCustomerAndPayments> {
    return await this.em.findOneOrFail(
      Order,
      {
        id,
      },
      {
        failHandler: OrderNotFoundError,
        populate: ['items.product.info', 'createdBy.info', 'customer.info', 'domain', 'payments'],
      },
    );
  }
}
