import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DomainMiddleware } from '@/utils/middlewares/domain-middleware';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Domain } from '@/persistence/entities/domain.entity';
import { ProductController } from './controllers/product-controller';
import { ProductService } from './services/product-service';
import { TOKENS } from '@/utils/types/tokens';

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [Domain],
    }),
  ],
  controllers: [ProductController],
  providers: [
    ProductService
  ],
})
export class CatalogModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(DomainMiddleware).forRoutes(ProductController);
  }
}
