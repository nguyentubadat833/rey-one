import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
import { SepayPaymentBaseStrategy } from './services/payment/sepay/sepay-base.strategy';
import { SepayQRcodeBankTransferStrategy } from './services/payment/sepay/payment-vietqr.bank-transfer.strategy';
import { ConfigModule } from '@nestjs/config';
import { paymentConfig } from '@/configs/payment.config';

@Module({
  imports: [
    ConfigModule.forFeature(paymentConfig),
    MikroOrmModule.forFeature({
      entities: [Domain, Order, OrderItem],
    }),
  ],
  controllers: [OrderController],
  providers: [DomainCache, CommerceService, OrderService, PaymentStrategyRegistry, SepayGatewayPaymentBankTransferStrategy, SepayQRcodeBankTransferStrategy],
})
export class CommerceModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(DomainMiddleware).forRoutes(OrderController);
  }

}