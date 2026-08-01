import { Injectable } from '@nestjs/common';
import { SepayPaymentBaseStrategy } from './sepay-base.strategy';
import { InitPaymentConfig, PaymentMethod, PaymentProvider } from '@rey-one/shared';
import { Order } from '@/persistence/entities/commerce-order.entity';
import { PaymentStrategy, SepayGatewayPaymentInitResult } from '../provider-strategies/payment-strategy.interface';
import { AppError } from '@/utils/errors/app.error';

@Injectable()
export class SepayGatewayPaymentBankTransferStrategy extends SepayPaymentBaseStrategy implements PaymentStrategy {
  readonly provider: PaymentProvider = 'sepay';
  readonly method: PaymentMethod = 'sepay_gateway_bank_transfer';

  async initPayment(order: Order, config: InitPaymentConfig): Promise<SepayGatewayPaymentInitResult> {
    if (order.currency !== 'VND') {
      throw new AppError('SEPAY_UNSUPPORTED_CURRENCY');
    }

    const content = `DH${order.code}`;

    const fields = this.client.checkout.initOneTimePaymentFields({
      customer_id: order.customer.id,
      order_amount: Number(order.totalAmount),
      merchant: this.config.sepay.merchantId,
      currency: String(order.currency).toUpperCase(),
      operation: 'PURCHASE',
      order_description: content,
      order_invoice_number: String(order.code),
      payment_method: 'BANK_TRANSFER',
      success_url: config.successUrl,
      cancel_url: config.cancelUrl,
      error_url: config.errorUrl,
    });

    const checkoutUrl = this.client.checkout.initCheckoutUrl();

    return {
      provider: this.provider,
      method: this.method,
      checkoutUrl,
      fields, // dùng để build HTML form auto-submit tới SePay
    };
  }
}
