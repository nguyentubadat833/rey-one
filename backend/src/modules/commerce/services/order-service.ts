import { AppClsStore } from '@/utils/types/system';
import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { AddOrderItemsDto, CreateOrderDto, UpdateOrderDto } from '../dtos/order-dto';
import { Order, OrderItem } from '@/persistence/entities/commerce-order.entity';
import { Party } from '@/persistence/entities/iam-party.entity';
import { Domain } from '@/persistence/entities/iam-domain.entity';
import { Product } from '@/persistence/entities/catalog-product.entity';
import { OrderNotFoundError } from '@/utils/errors/order.error';
import { CommerceService } from './commerce-service';
import { AppError } from '@/utils/errors/app.error';
import { OrderPaymentType } from '@rey-one/shared';
import { PartyNotFoundError } from '@/utils/errors/party.error';
import { User } from '@/persistence/entities/iam-user.entity';
import { OrderLoadedCustomerAndCreatedByAndItems, OrderLoadedCustomerAndDomainAndPayments } from '@/persistence/types/order-type';

@Injectable()
export class OrderService {
  constructor(
    private readonly commerceService: CommerceService,
    private readonly em: EntityManager,
    private readonly clsService: ClsService<AppClsStore>,
  ) {}

  private getDomainIdFromStore() {
    return this.clsService.get('domainId');
  }

  private getActorIdFromStore() {
    return this.clsService.get('actor.id');
  }

  private async orderItemsFromRequest(order: Order, items: AddOrderItemsDto[]): Promise<OrderItem[]> {
    if (!items.length) {
      throw new AppError('ITEMS_REQUIRED', 'Order items cannot be empty');
    }

    const productIds = [...new Set(items.map((item) => item.productId))];

    const products = await this.em.find(Product, { id: { $in: productIds } }, { populate: ['info'] });
    if (products.length !== productIds.length) {
      const foundIds = new Set(products.map((product) => product.id));
      const missingIds = productIds.filter((id) => !foundIds.has(id));

      throw new AppError('OBJECT_NOT_FOUND', `The following product(s) were not found: ${missingIds.join(', ')}.`);
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

  async createOrder(paymentType: OrderPaymentType, dto: CreateOrderDto, domainId = this.getDomainIdFromStore(), actorId: string = this.getActorIdFromStore()) {
    if (paymentType !== 'one_time') {
      throw new AppError('ORDER_PAYMENT_NOT_SUPPORTED');
    }

    let customer: Party;

    if (dto.customer.id) {
      customer = await this.em.findOneOrFail(
        Party,
        { 
          id: dto.customer.id,
          // customerDomain: domainId
        },
        {
          failHandler: PartyNotFoundError,
        },
      );

      this.commerceService.ensurePartyCanOrder(customer);
    } else {
      customer = this.em.create(Party, {
        code: Party.generatePartyCode(),
        name: dto.customer.name,
        // customerDomain: domainId
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
    await this.em.populate(order, ['createdBy.party']);

    return order as OrderLoadedCustomerAndCreatedByAndItems;
  }

  async updateOrder(orderId: string, dto: UpdateOrderDto) {
    const order = await this.em.findOneOrFail(
      Order,
      {
        id: orderId,
      },
      {
        failHandler: OrderNotFoundError,
        populate: ['items.product.info', 'createdBy.party', 'customer'],
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
    return order as OrderLoadedCustomerAndCreatedByAndItems;
  }

  async getOrderById(id: string): Promise<OrderLoadedCustomerAndDomainAndPayments> {
    return await this.em.findOneOrFail(
      Order,
      {
        id,
      },
      {
        failHandler: OrderNotFoundError,
        populate: ['domain', 'customer', 'payments'],
      },
    );
  }
}
