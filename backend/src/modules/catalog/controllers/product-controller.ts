import { Body, Controller, Get, Inject, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiDomainHeader } from '@/utils/decorators/utils.decorator';
import { RequireAuth } from '@/utils/decorators/auth.decorator';
import { EntityManager } from '@mikro-orm/core';
import { ApiTags } from '@nestjs/swagger';
import { TOKENS } from '@/utils/types/tokens';
import type { DomainUtils } from '@/modules/contracts';
@RequireAuth()
@ApiDomainHeader()
@ApiTags('Catalog / Products')
@Controller('products')
export class ProductController {
  constructor(
    private readonly em: EntityManager,
    @Inject(TOKENS.DOMAIN_UTILS ) private readonly domainUtils: DomainUtils
    // private readonly productService: ProductService,
  ) {}

//   @RequirePermission('product:read', false)
//   @ApiOperation({ summary: 'Product summaries' })
//   @Get()
//   async summaries(@Query() { limit, page }: PaginationQueryDto) {
//     const [data, total] = await this.em.findAndCount(
//       Product,
//       {},
//       {
//         populate: ['info'],
//         limit,
//         offset: (page - 1) * limit,
//         orderBy: [
//           {
//             createdAt: 'DESC',
//           },
//         ],
//       },
//     );

//     const products = data.map((item) => ProductMapper.toProductSummary(item));
//     return ResponseMapper.toPaginatedResponse(products, total, page, limit);
//   }

//   @RequirePermission('product:manage')
//   @ApiOperation({ summary: 'Create product' })
//   @Post()
//   async createProduct(@Body() dto: CreateProductDto) {
//     return await this.productService.createProduct(dto).then(ProductMapper.toProductView);
//   }

//   @RequirePermission('product:manage')
//   @ApiOperation({ summary: 'Update product' })
//   @Patch(':id')
//   async updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
//     return await this.productService.updateProduct(id, dto).then(ProductMapper.toProductView);
//   }

//   @RequirePermission('product:read', false)
//   @ApiOperation({ summary: 'Get Product' })
//   @Get(':id')
//   async getProduct(@Param('id') id: string) {
//     return await this.productService.getProductById(id).then(ProductMapper.toProductView);
//   }
}
