import { Injectable } from '@nestjs/common';
import { PaymentStrategy } from './payment-strategy.interface';
import { PaymentMethod } from '@rey-one/shared';
import { SepayGatewayPaymentBankTransferStrategy } from '../sepay/payment-gateway.bank-transfer.strategy';
import { SepayQRcodeBankTransferStrategy } from '../sepay/payment-vietqr.bank-transfer.strategy';
import { AppError } from '@/utils/errors/app.error';

@Injectable()
export class PaymentStrategyRegistry {
  private readonly strategies = new Map<PaymentMethod, PaymentStrategy>();

  constructor(sepayGatewayStrategy: SepayGatewayPaymentBankTransferStrategy, sepayQrcodeStrategy: SepayQRcodeBankTransferStrategy) {
    this.strategies.set('sepay_gateway_bank_transfer', sepayGatewayStrategy);
    this.strategies.set('sepay_qrcode_bank_transfer', sepayQrcodeStrategy)
  }

  resolve(method: PaymentMethod): PaymentStrategy {
    const strategy = this.strategies.get(method);
    if (!strategy) {
      throw new AppError('PAYMENT_METHOD_NOT_SUPPORTED');
    }
    return strategy;
  }
}