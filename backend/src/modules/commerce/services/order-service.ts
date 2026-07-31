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

@Injectable()
export class OrderService {
  constructor(
    private readonly em: EntityManager,
    private readonly clsService: ClsService<AppClsStore>,
  ) {}

  private getDomainIdFromStore() {
    return this.clsService.get('domainId');
  }

  private async orderItemsFromRequest(order: Order, items: AddOrderItemsDto[]): Promise<OrderItem[]> {
    if (!items.length) {
      throw new AppError('ITEMS_REQUIRED', 'Order items cannot be empty');
    }

    const productIds = [...new Set(items.map((item) => item.productId))];

    const products = await this.em.find(Product, { id: { $in: productIds } });
    if (products.length !== productIds.length) {
      const foundIds = new Set(products.map((product) => product.id));
      const missingIds = productIds.filter((id) => !foundIds.has(id));

      throw new AppError('OBJECT_NOT_FOUND', `The following product(s) were not found: ${missingIds.join(', ')}.`);
    }

    const productById = new Map(products.map((product) => [product.id, product]));
    return items.map((item) => {
      const product = productById.get(item.productId)!;

      CommerceService.ensureProductSellable(product);
      return this.em.create(OrderItem, {
        order,
        product,
        subtotal: item.subtotal,
        metadata: item.metadata,
      });
    });
  }

  async createOrder(paymentType: OrderPaymentType, createById: string, dto: CreateOrderDto, domainId = this.getDomainIdFromStore()) {
    const order = this.em.create(Order, {
      paymentType: paymentType,
      totalAmount: dto.totalAmount,
      metadata: dto.metadata,
      customer: this.em.getReference(Party, dto.partyId),
      domain: this.em.getReference(Domain, domainId),
      createdBy: this.em.getReference(Party, createById),
      status: 'draft',
    });

    const items = await this.orderItemsFromRequest(order, dto.items);
    order.items.set(items);
    await this.em.flush();

    return order;
  }

  async updateOrder(orderId: string, dto: UpdateOrderDto) {
    const order = await this.em.findOneOrFail(
      Order,
      {
        id: orderId,
      },
      {
        failHandler: OrderNotFoundError,
        populate: ['items'],
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
    return order;
  }
}
