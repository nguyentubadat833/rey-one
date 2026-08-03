import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { PaymentMethod } from '@rey-one/shared';
import { CommerceService } from '../commerce-service';
import { Payment } from '@/persistence/entities/commerce-payment.entity';
import { OrderLoadedCustomerAndDomainAndPayments } from '@/persistence/types/order-type';
import { PaymentLoadedOrder } from '@/persistence/types/payment-type';

export interface CreatePaymentInput {
  method: PaymentMethod;
  order: OrderLoadedCustomerAndDomainAndPayments;
  //   amount?: bigint;  nếu không phải order payment === 'one_time' thì phải có amount riêng
}

@Injectable()
export class PaymentService {
  constructor(
    private readonly commerceService: CommerceService,
    private readonly em: EntityManager,
  ) {}

  async createPayment(input: CreatePaymentInput): Promise<Payment> {
    const order = input.order;
    this.commerceService.ensureOrderCanBePayment(order);

    let payment = order.payments.getItems().find((payment) => payment.status === 'pending');

    if (payment) {
      this.em.assign(payment, {
        method: input.method,
      });
    } else {
      payment = this.em.create(Payment, {
        order: input.order,
        amount: order.totalAmount, // amount có thể  không phải order,totalAmount nếu là không phải one_time
        currency: order.currency,
        method: input.method,
        status: 'pending',
      });
    }

    await this.em.flush();
    return payment;
  }

  async getPaymentsByOrderId(orderId: string): Promise<PaymentLoadedOrder[]> {
    return await this.em.find(
      Payment,
      {
        order: orderId,
      },
      {
        populate: ['order'],
      },
    );
  }
}
