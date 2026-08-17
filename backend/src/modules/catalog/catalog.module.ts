import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { DomainMiddleware } from '@/utils/middlewares/domain-middleware';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Domain } from '@/persistence/entities/domain.entity';
import { ProductController } from './controllers/product-controller';
import { IAMModule } from '../iam/iam.module';
@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [Domain],
    }),
  ],
  controllers: [ProductController],
  providers: [
    // ProductService
  ],
})
export class CatalogModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(DomainMiddleware).forRoutes(ProductController);
  }
}
