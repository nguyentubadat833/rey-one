import { Inject, Injectable } from '@nestjs/common';
import { InitPaymentInput, PaymentMethod } from '@rey-one/shared';
import { PaymentStrategy, SepayGatewayStrategy } from '../provider-strategies/payment-strategy';
import { SePayPgClient } from 'sepay-pg-node';
import { TOKENS } from '@/utils/types/tokens';
import { paymentConfig } from '@/configs/payment.config';
import { PaymentService } from '../payment-service';
import { OrderService } from '../../order-service';
import { SepayUnsupportedCurrencyError } from '@/utils/errors/payment.error';
import type { ConfigType } from '@nestjs/config';

@Injectable()
export class SepayGatewayPaymentBankTransferStrategy implements PaymentStrategy {
  readonly method: PaymentMethod = 'sepay:gateway:bank-transfer';

  constructor(
    @Inject(TOKENS.SEPAY_CLIENT) private readonly sepayClient: SePayPgClient,
    @Inject(paymentConfig.KEY) readonly config: ConfigType<typeof paymentConfig>,
    private readonly orderService: OrderService,
    private readonly paymentService: PaymentService,
  ) {}

  async initPayment(params: InitPaymentInput): Promise<SepayGatewayStrategy> {
    const order = await this.orderService.getOrderById(params.orderId);
    const orderCode = order.code;
    const customerCode = order.customer.code

    if (order.currency !== 'VND') {
      throw SepayUnsupportedCurrencyError(order.currency)
    }

    const payment = await this.paymentService.createPayment({
      method: this.method,
      order,
    });
    const paymentCode = payment.code

    const fields = this.sepayClient.checkout.initOneTimePaymentFields({
      customer_id: customerCode,
      order_amount: Number(payment.amount),
      merchant: this.config.sepay.merchantId,
      currency: payment.currency,
      operation: 'PURCHASE',
      order_description: `DH${orderCode}`,
      order_invoice_number: orderCode,
      payment_method: 'BANK_TRANSFER',
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      error_url: params.errorUrl,
    });

    const checkoutUrl = this.sepayClient.checkout.initCheckoutUrl();

    return {
      orderCode,
      paymentCode,
      checkoutUrl,
      fields, // dùng để build HTML form auto-submit tới SePay
    };
  }
}
