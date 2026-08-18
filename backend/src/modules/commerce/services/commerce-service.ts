import { Product } from '@/persistence/entities/product.entity';
import { User } from '@/persistence/entities/user.entity';
import { OrderLoadedDomainAndCustomerAndPayments } from '@/persistence/types/order-type';
import { AppError } from '@/utils/errors/app.error';
import { InvalidOrderStatus, OrderPaymentTypeUnsupported } from '@/utils/errors/order.error';
import { PaymentAlreadyProcessingError, PaymentAlreadySucceededError } from '@/utils/errors/payment.error';
import { InvalidProductStatusError } from '@/utils/errors/product.error';
import { Injectable } from '@nestjs/common';
import { OrderStatus } from '@rey-one/shared';

const orderPaidStatuses: OrderStatus[] = ['confirmed', 'processing', 'completed'];
const invalidOrderStatuses: OrderStatus[] = ['cancelled', 'expired', 'partially_refunded', 'refunded'];
@Injectable()
export class CommerceService {
  constructor() {}

  ensureProductSellable(product: Product) {
    if (product.status !== 'active') {
      throw InvalidProductStatusError();
    }
  }

  ensureCustomerCanOrder(customer: User) {
    if(!customer.isCustomer()){
        throw AppError.withMessage('BUSINESS_RULE_VIOLATION', 'Only customers can place orders')
    }

    if(!customer.isActive()){
        throw AppError.withMessage('INVALID_STATUS', 'Customer must be active to place an order')
    } 
  }

  ensureOrderCanBePayment(order: OrderLoadedDomainAndCustomerAndPayments) {
    if (order.paymentType === 'one_time') {
      const orderStatus = order.status;

      if (orderPaidStatuses.includes(orderStatus)) {
        throw InvalidOrderStatus(`Current status: ${orderStatus}`);
      }

      if (invalidOrderStatuses.includes(orderStatus)) {
        throw InvalidOrderStatus(`Current status: ${orderStatus}`);
      }

      const payments = order.payments.getItems();
      if (payments.length) {
        const paymentSucceeded = payments.find((payment) => payment.status === 'succeeded');
        if (paymentSucceeded) {
          throw PaymentAlreadySucceededError();
        }

        const paymentProcessing = payments.find((payment) => payment.status === 'processing');
        if (paymentProcessing) {
          throw PaymentAlreadyProcessingError();
        }
      }

      return;
    }

    throw OrderPaymentTypeUnsupported(order.paymentType);
  }
}
