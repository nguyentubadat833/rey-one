import { AppClsStore } from '@/utils/types/system';
import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { CreateOrderDto, UpdateOrderDto } from '../dtos/order-dto';
import { Order, OrderItem } from '@/persistence/entities/commerce-order.entity';
import { Party } from '@/persistence/entities/iam-party.entity';
import { Domain } from '@/persistence/entities/iam-domain.entity';
import { Product } from '@/persistence/entities/catalog-product.entity';
import { OrderNotFound } from '@/utils/errors/order.error';

@Injectable()
export class OrderService {
  constructor(
    private readonly em: EntityManager,
    private readonly clsService: ClsService<AppClsStore>,
  ) {}

  private getDomainIdFromStore() {
    return this.clsService.get('domainId');
  }

  async createOrder(domainId = this.getDomainIdFromStore(), dto: CreateOrderDto) {
    const order = this.em.create(Order, {
      paymentType: dto.paymentType,
      totalAmount: dto.totalAmount,
      metadata: dto.metadata,
      customer: this.em.getReference(Party, dto.partyId),
      domain: this.em.getReference(Domain, domainId),
      status: 'draft',
    });

    order.items.set(
      dto.items.map((item) =>
        this.em.create(OrderItem, {
          order,
          product: this.em.getReference(Product, item.productId),
          subtotal: item.subtotal,
          metadata: item.metadata,
        }),
      ),
    );

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
        failHandler: OrderNotFound,
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
      order.items.set(
        dto.items.map((item) =>
          this.em.create(OrderItem, {
            order,
            product: this.em.getReference(Product, item.productId),
            subtotal: item.subtotal,
            metadata: item.metadata,
          }),
        ),
      );
    }

    await this.em.flush();
    return order;
  }
}
