// import { Inject, Injectable } from '@nestjs/common';
// import { InitPaymentInput, PaymentMethod } from '@rey-one/shared';
// import { PaymentStrategy, SepayQRCodeStrategy } from '../provider-strategies/payment-strategy';
// import { AppError } from '@/utils/errors/app.error';
// import { paymentConfig } from '@/configs/payment.config';
// import { SERVICE_TOKENS } from '@/utils/types/tokens';
// import { SePayPgClient } from 'sepay-pg-node';
// import { OrderService } from '../../order-service';
// import { PaymentService } from '../payment-service';
// import type { ConfigType } from '@nestjs/config';

// @Injectable()
// export class SepayQRcodeBankTransferStrategy implements PaymentStrategy {
//   readonly method: PaymentMethod = 'sepay:qrcode:bank-transfer';

//   constructor(
//     @Inject(SERVICE_TOKENS.SEPAY_CLIENT) private readonly sepayClient: SePayPgClient,
//     @Inject(paymentConfig.KEY) readonly config: ConfigType<typeof paymentConfig>,
//     private readonly orderService: OrderService,
//     private readonly paymentService: PaymentService,
//   ) {}

//   async initPayment(params: InitPaymentInput): Promise<SepayQRCodeStrategy> {
//     const order = await this.orderService.getOrderById(params.orderId);
//     const orderCode = order.code;

//     if (order.currency !== 'VND') {
//       throw new AppError('SEPAY_UNSUPPORTED_CURRENCY');
//     }

//     const payment = await this.paymentService.createPayment({
//       method: this.method,
//       order,
//     });
//     const paymentCode = payment.code;

//     const amount = Number(payment.amount);

//     const baseURL = new URL('https://vietqr.app/img');
//     baseURL.searchParams.set('acc', this.config.sepay.bank.bkAcc);
//     baseURL.searchParams.set('bank', this.config.sepay.bank.bkName);
//     baseURL.searchParams.set('amount', amount.toString());
//     baseURL.searchParams.set('des', `TKP${this.config.sepay.bank.bkVACode}` + ' ' + `${orderCode}`);
//     baseURL.searchParams.set('showinfo', 'true');
//     baseURL.searchParams.set('fullacc', 'true');
//     baseURL.searchParams.set('holder', this.config.sepay.bank.bkHolder);
//     baseURL.searchParams.set('compact', 'true');

//     return {
//       orderCode,
//       paymentCode,
//       qrUrl: baseURL.toString(),
//     };
//   }
// }
