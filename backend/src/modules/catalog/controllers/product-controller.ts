import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ProductService } from '../services/product-service';
import { ApiDomainHeader } from '@/utils/decorators/utils.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequireAuth, RequirePermission } from '@/utils/decorators/auth.decorator';
import { CreateProductDto } from '../dtos/product-dto';
import { ProductMapper } from '../mappers/product-mapper';
import { EntityManager } from '@mikro-orm/core';
import { Product } from '@/persistence/entities/catalog-product.entity';

@RequireAuth()
@ApiDomainHeader()
@ApiTags('Catalog / Products')
@Controller('products')
export class ProductController {
  constructor(
    private readonly em: EntityManager,
    private readonly productService: ProductService,
  ) {}

  @RequirePermission('domain:product:read')
  @ApiOperation({ summary: 'Product summaries' })
  @Get()
  async summaries() {
    return await this.em.find(Product, {}, { populate: ['info'] }).then((rs) => rs.map((item) => ProductMapper.toProductSummary(item)));
  }

  @RequirePermission('domain:product:manage')
  @ApiOperation({ summary: 'Create product' })
  @Post()
  async createProduct(@Body() dto: CreateProductDto) {
    return await this.productService.createProduct(dto).then(ProductMapper.toProductView);
  }

  @RequirePermission('domain:product:manage')
  @ApiOperation({ summary: 'Update product' })
  @Patch(':id')
  async updateProduct(@Param('id') id: string, @Body() dto: CreateProductDto) {
    return await this.productService.updateProduct(id, dto).then(ProductMapper.toProductView);
  }

  @RequirePermission('domain:product:read')
  @ApiOperation({ summary: 'Get Product' })
  @Get(':id')
  async getProduct(@Param('id') id: string) {

  }
}
