import { Module } from '@nestjs/common';
import { ProductService } from './services/product-service';
import { ProductController } from './controllers/product-controller';
import { ConfigModule } from '@nestjs/config';
import { authConfig } from '@/configs/auth.config';

@Module({
  // imports: [ConfigModule.forFeature(authConfig)],
  controllers: [ProductController],
  providers: [ProductService],
})
export class CatalogModule {}
