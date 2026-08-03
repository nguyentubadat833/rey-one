import { MiddlewareConsumer, Module, NestModule, Provider } from '@nestjs/common';
import { OrderService } from './services/order-service';
import { OrderController } from './controllers/order-controller';
import { CommerceService } from './services/commerce-service';
import { DomainCache } from '@/utils/cache/domain-cache';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Order, OrderItem } from '@/persistence/entities/commerce-order.entity';
import { Domain } from '@/persistence/entities/iam-domain.entity';
import { DomainMiddleware } from '@/utils/middlewares/domain-middleware';
import { PaymentStrategyRegistry } from './services/payment/provider-strategies/payment-strategy.registry';
import { SepayGatewayPaymentBankTransferStrategy } from './services/payment/sepay/payment-gateway.bank-transfer.strategy';
import { SepayQRcodeBankTransferStrategy } from './services/payment/sepay/payment-vietqr.bank-transfer.strategy';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { paymentConfig } from '@/configs/payment.config';
import { SERVICE_TOKENS } from '@/utils/types/tokens';
import { SePayPgClient } from 'sepay-pg-node';
import { PaymentService } from './services/payment/payment-service';
import { PaymentController } from './controllers/payment-controller';

const SepayClient: Provider = {
  provide: SERVICE_TOKENS.SEPAY_CLIENT,
  inject: [paymentConfig.KEY],
  useFactory: (config: ConfigType<typeof paymentConfig>) => {
    return new SePayPgClient({
      env: config.sepay.env,
      merchant_id: config.sepay.merchantId,
      secret_key: config.sepay.merchantSecretKey,
    });
  },
};

@Module({
  imports: [
    ConfigModule.forFeature(paymentConfig),
    MikroOrmModule.forFeature({
      entities: [Domain, Order, OrderItem],
    }),
  ],
  controllers: [OrderController, PaymentController],
  providers: [
    SepayClient,
    DomainCache,
    //
    CommerceService,
    OrderService,
    PaymentService,
    //
    PaymentStrategyRegistry,
    SepayGatewayPaymentBankTransferStrategy,
    SepayQRcodeBankTransferStrategy,
  ],
})
export class CommerceModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(DomainMiddleware).forRoutes(OrderController);
  }
}
