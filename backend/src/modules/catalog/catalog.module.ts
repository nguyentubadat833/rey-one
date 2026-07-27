import { Module } from '@nestjs/common';
import { ProductService } from './services/product-service';
import { ProductController } from './controllers/product-controller';

@Module({
  // imports: [ConfigModule.forFeature(authConfig)],
  imports: [],
  controllers: [ProductController],
  providers: [ProductService],
})
export class CatalogModule {}
