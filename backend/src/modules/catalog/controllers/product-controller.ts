import { Body, Controller, Post } from '@nestjs/common';
import { ProductService } from '../services/product-service';
import { ApiDomainHeader, CurrentHeader } from '@/utils/decorators/utils.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequireAuth, RequirePermission } from '@/utils/decorators/auth.decorator';
import { DOMAIN_ID_HEADER } from '@/utils/types/utils';
import { CreateProductDto } from '../dtos/product-dto';
import { ProductMapper } from '../mappers/product-mapper';

@RequireAuth()
@ApiDomainHeader()
@ApiTags('Catalog / Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @RequirePermission('product:manage')
  @ApiOperation({ summary: 'Create product' })
  @Post()
  async createProduct(@CurrentHeader(DOMAIN_ID_HEADER) domainId: string, @Body() dto: CreateProductDto) {
    return await this.productService.createProduct(domainId, dto).then(ProductMapper.toProductView);
  }
}
