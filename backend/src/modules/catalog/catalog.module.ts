import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ProductService } from './services/product-service';
import { ProductController } from './controllers/product-controller';
import { DomainMiddleware } from '@/utils/middlewares/domain-middleware';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Domain } from '@/persistence/entities/domain.entity';
import { DomainCache } from '@/utils/cache/domain-cache';
@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [Domain],
    }),
  ],
  controllers: [ProductController],
  providers: [
    DomainCache, 
    ProductService
  ],
})
export class CatalogModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(DomainMiddleware).forRoutes(ProductController);
  }
}
