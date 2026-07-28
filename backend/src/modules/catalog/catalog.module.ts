import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ProductService } from './services/product-service';
import { ProductController } from './controllers/product-controller';
import { DomainMiddleware } from '@/utils/middlewares/domain-middleware';

@Module({
  imports: [],
  controllers: [ProductController],
  providers: [ProductService],
})
export class CatalogModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(DomainMiddleware).forRoutes(ProductController);
  }
}
