import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiDomainHeader } from '@/utils/decorators/utils.decorator';
import { RequireAuth, RequireDomainPermission } from '@/utils/decorators/auth.decorator';
import { EntityManager } from '@mikro-orm/core';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductService } from '../services/product-service';
import { PaginationQueryDto } from '@/utils/dtos/utils-dto';
import { Product } from '@/persistence/entities/product.entity';
import { ProductMapper } from '../mappers/product-mapper';
import { ResponseMapper } from '@/utils/mappers/response-mapper';
import { createZodDto } from 'nestjs-zod';
import { createPaginatedResponseSchema, ProductSummarySchema } from '@rey-one/shared';
import { CreateProductDto, UpdateProductDto } from '../dtos/product-dto';
@RequireAuth()
@ApiDomainHeader()
@ApiTags('Catalog / Products')
@Controller('products')
export class ProductController {
  constructor(
    private readonly em: EntityManager,
    // @Inject(TOKENS.DOMAIN_UTILS ) private readonly domainUtils: DomainUtils,
    private readonly productService: ProductService,
  ) {}

  @RequireDomainPermission('product@read')
  @ApiOperation({ summary: 'Product summaries' })
  @ApiOkResponse({
    type: createZodDto(createPaginatedResponseSchema(ProductSummarySchema))
  })
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

    const products = data.map((item) => ProductMapper.toProductSummaryDto(item));
    return ResponseMapper.toPaginatedResponse(products, total, page, limit);
  }

  @RequireDomainPermission('product@create', true)
  @ApiOperation({ summary: 'Create product' })
  @Post()
  async createProduct(@Body() dto: CreateProductDto) {
    return await this.productService.createProduct(dto).then(ProductMapper.toProductDto);
  }

  @RequireDomainPermission('product@update', true)
  @ApiOperation({ summary: 'Update product' })
  @Patch(':id')
  async updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return await this.productService.updateProduct(id, dto).then(ProductMapper.toProductDto);
  }

  @RequireDomainPermission('product@read')
  @ApiOperation({ summary: 'Get Product' })
  @Get(':id')
  async getProduct(@Param('id') id: string) {
    return await this.productService.getProductById(id).then(ProductMapper.toProductDto);
  }
}
