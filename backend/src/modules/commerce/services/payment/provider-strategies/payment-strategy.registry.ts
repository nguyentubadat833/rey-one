import { Injectable } from '@nestjs/common';
import { PaymentStrategy } from './payment-strategy';
import { PaymentMethod } from '@rey-one/shared';
import { SepayGatewayPaymentBankTransferStrategy } from '../sepay/payment-gateway.bank-transfer.strategy';
import { AppError } from '@/utils/errors/app.error';
import { SepayQRcodeBankTransferStrategy } from '../sepay/payment-vietqr.bank-transfer.strategy';

@Injectable()
export class PaymentStrategyRegistry {
  private readonly strategies = new Map<PaymentMethod, PaymentStrategy>();

  constructor(
    private readonly sepayGatewayStrategy: SepayGatewayPaymentBankTransferStrategy,
    private readonly sepayQrcodeStrategy: SepayQRcodeBankTransferStrategy,
  ) {
    this.strategies.set('sepay:gateway:bank-transfer', this.sepayGatewayStrategy);
    this.strategies.set('sepay:qrcode:bank-transfer', this.sepayQrcodeStrategy);
  }

  resolve(method: PaymentMethod): PaymentStrategy {
    const strategy = this.strategies.get(method);
    if (!strategy) {
      throw new AppError('PAYMENT_METHOD_NOT_SUPPORTED');
    }
    return strategy;
  }
}
