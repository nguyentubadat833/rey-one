import { Inject, Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { Product } from '@/persistence/entities/product.entity';
import { ProductNotFoundError } from '@/utils/errors/product.error';
import { TOKENS } from '@/utils/types/tokens';
import { CreateProductDto, UpdateProductDto } from '../dtos/product-dto';
import { ProductLoadedInfo } from '@/persistence/types/product-type';
import type { DomainUtils } from '@/modules/contracts';
@Injectable()
export class ProductService {
  constructor(
    private readonly em: EntityManager,
    @Inject(TOKENS.DOMAIN_UTILS ) private readonly domainService: DomainUtils
  ) { }

  private getDefaultCostFromInput(input?: number | null): bigint | null {
    return input ? BigInt(input) : null;
  }

  async createProduct(dto: CreateProductDto): Promise<ProductLoadedInfo> {
    const product = this.em.create(Product, {
      info: {
        name: dto.name,
        description: dto.description,
      },
      domain: this.domainService.getDomainIdFromContext(),
      currency: dto.currency,
      defaultCost: this.getDefaultCostFromInput(dto.defaultCost),
      trackInventory: dto.trackingInventory,
      status: dto.status,
      type: dto.type,
    });

    await this.em.flush();
    return product;
  }

  async updateProduct(productId: string, dto: UpdateProductDto): Promise<ProductLoadedInfo> {
    const product = await this.em.findOneOrFail(
      Product,
      { id: productId },
      {
        failHandler: ProductNotFoundError,
        populate: ['info']
      },
    );

    this.em.assign(product, {
      currency: dto.currency,
      defaultCost: this.getDefaultCostFromInput(dto.defaultCost),
      trackInventory: dto.trackingInventory,
      status: dto.status,
    }, {
      ignoreUndefined: true
    });

    this.em.assign(product.info,
      {
        name: dto.name,
        description: dto.description,
      },
      {
        ignoreUndefined: true
      }
    )

    await this.em.flush();
    return product as ProductLoadedInfo;
  }

  async getProductById(id: string): Promise<ProductLoadedInfo> {
    return await this.em.findOneOrFail(
      Product,
      { id },
      {
        populate: ['info'],
        failHandler: ProductNotFoundError,
      },
    );
  }
}
