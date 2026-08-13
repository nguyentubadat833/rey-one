// import { Product } from '@/persistence/entities/product.entity';
// import { Party } from '@/persistence/entities/iam-party.entity';
// import { OrderLoadedCustomerAndDomainAndPayments } from '@/persistence/types/order-type';
// import { AppError } from '@/utils/errors/app.error';
// import { InvalidOrderStatus, OrderAlreadyPaid } from '@/utils/errors/order.error';
// import { PaymentAlreadyProcessing, PaymentAlreadySucceeded } from '@/utils/errors/payment.error';
// import { InvalidProductStatusError } from '@/utils/errors/product.error';
// import { Injectable } from '@nestjs/common';
// import { OrderStatus, PaymentStatus } from '@rey-one/shared';

// const orderPaidStatuses: OrderStatus[] = ['confirmed', 'processing', 'completed'];
// const invalidOrderStatuses: OrderStatus[] = ['cancelled', 'expired', 'partially_refunded', 'refunded'];
// @Injectable()
// export class CommerceService {
//   constructor() {}

//   ensureProductSellable(product: Product) {
//     if (product.status !== 'active') {
//       throw InvalidProductStatusError();
//     }
//   }

//   ensurePartyCanOrder(party: Party) {}

//   ensureOrderCanBePayment(order: OrderLoadedCustomerAndDomainAndPayments) {
//     if (order.paymentType === 'one_time') {
//       const orderStatus = order.status;

//       if (orderPaidStatuses.includes(orderStatus)) {
//         throw OrderAlreadyPaid();
//       }

//       if (invalidOrderStatuses.includes(orderStatus)) {
//         throw InvalidOrderStatus();
//       }

//       const payments = order.payments.getItems();
//       if (payments.length) {
//         const paymentSucceeded = payments.find((payment) => payment.status === 'succeeded');
//         if (paymentSucceeded) {
//           throw PaymentAlreadySucceeded();
//         }

//         const paymentProcessing = payments.find((payment) => payment.status === 'processing');
//         if (paymentProcessing) {
//           throw PaymentAlreadyProcessing();
//         }
//       }

//       return
//     }

//     throw new AppError('ORDER_PAYMENT_NOT_SUPPORTED');
//   }
// }
