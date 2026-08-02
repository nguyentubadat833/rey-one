import { paymentConfig } from '@/configs/payment.config';
import { Inject, Injectable } from '@nestjs/common';
import { SePayPgClient } from 'sepay-pg-node';
import { AppError } from '@/utils/errors/app.error';
import type { ConfigType } from '@nestjs/config';

export interface SepayPaymentBaseStrategy {
  client: SePayPgClient;
}

@Injectable()
export abstract class SepayPaymentBaseStrategy {
  
  constructor(@Inject(paymentConfig.KEY) readonly config: ConfigType<typeof paymentConfig>) {
    this.client = new SePayPgClient({
      env: this.config.sepay.env,
      merchant_id: this.config.sepay.merchantId,
      secret_key: this.config.sepay.merchantSecretKey,
    });
  }

  async cancelOrder(orderId: string) {
    try {
      await this.client.order.cancel(orderId);
    } catch (error) {
      throw new AppError('SEPAY_PAYMENT_ERROR', error);
    }
  }
}
