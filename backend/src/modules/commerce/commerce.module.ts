import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { OrderService } from './services/order-service';
import { OrderController } from './controllers/order-controller';
import { CommerceService } from './services/commerce-service';
import { DomainCache } from '@/utils/cache/domain-cache';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Order, OrderItem } from '@/persistence/entities/commerce-order.entity';
import { Domain } from '@/persistence/entities/iam-domain.entity';
import { DomainMiddleware } from '@/utils/middlewares/domain-middleware';
import { PaymentStrategyRegistry } from './services/payment-service/provider-strategies/payment-strategy.registry';
import { SepayGatewayPaymentBankTransferStrategy } from './services/payment-service/sepay/payment-gateway.bank-transfer.strategy';

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [Domain, Order, OrderItem],
    }),
  ],
  controllers: [OrderController],
  providers: [DomainCache, CommerceService, OrderService, PaymentStrategyRegistry, SepayGatewayPaymentBankTransferStrategy],
})
export class CommerceModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(DomainMiddleware).forRoutes(OrderController);
  }

}