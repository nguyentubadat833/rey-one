import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ProductService } from '../services/product-service';
import { ApiDomainHeader } from '@/utils/decorators/utils.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequireAuth, RequirePermission } from '@/utils/decorators/auth.decorator';
import { CreateProductDto, UpdateProductDto } from '../dtos/product-dto';
import { ProductMapper } from '../mappers/product-mapper';
import { EntityManager } from '@mikro-orm/core';
import { Product } from '@/persistence/entities/product.entity';
import { PaginationQueryDto } from '@/utils/dtos/utils-dto';
import { ResponseMapper } from '@/utils/mappers/response-mapper';

@RequireAuth()
@ApiDomainHeader()
@ApiTags('Catalog / Products')
@Controller('products')
export class ProductController {
  constructor(
    private readonly em: EntityManager,
    private readonly productService: ProductService,
  ) {}

  @RequirePermission('product:read', false)
  @ApiOperation({ summary: 'Product summaries' })
  @Get()
  async summaries(@Query() { limit, page }: PaginationQueryDto) {
    const [data, total] = await this.em.findAndCount(
      Product,
      {},
      {
        populate: ['info'],
        limit,
        offset: (page - 1) * limit,
        orderBy: [
          {
            createdAt: 'DESC',
          },
        ],
      },
    );

    const products = data.map((item) => ProductMapper.toProductSummary(item));
    return ResponseMapper.toPaginatedResponse(products, total, page, limit);
  }

  @RequirePermission('product:manage')
  @ApiOperation({ summary: 'Create product' })
  @Post()
  async createProduct(@Body() dto: CreateProductDto) {
    return await this.productService.createProduct(dto).then(ProductMapper.toProductView);
  }

  @RequirePermission('product:manage')
  @ApiOperation({ summary: 'Update product' })
  @Patch(':id')
  async updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return await this.productService.updateProduct(id, dto).then(ProductMapper.toProductView);
  }

  @RequirePermission('product:read', false)
  @ApiOperation({ summary: 'Get Product' })
  @Get(':id')
  async getProduct(@Param('id') id: string) {
    return await this.productService.getProductById(id).then(ProductMapper.toProductView);
  }
}
