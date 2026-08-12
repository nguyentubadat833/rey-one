import { DomainMiddleware } from '@/utils/middlewares/domain-middleware';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CustomerController } from './controllers/customer.controller';

@Module({
  providers: [],
  controllers: [],
})
export class CrmModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(DomainMiddleware).forRoutes(CustomerController);
  }
}