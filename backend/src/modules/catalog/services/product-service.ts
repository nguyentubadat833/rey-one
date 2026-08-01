import { Injectable } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from '../dtos/product-dto';
import { EntityManager } from '@mikro-orm/core';
import { Product } from '@/persistence/entities/catalog-product.entity';
import { Domain } from '@/persistence/entities/iam-domain.entity';
import { ClsService } from 'nestjs-cls';
import { AppClsStore } from '@/utils/types/system';
import { ProductLoadedInfo } from '@/persistence/types/product-type';
import { ProductNotFoundError } from '@/utils/errors/product.error';

@Injectable()
export class ProductService {
  constructor(
    private readonly em: EntityManager,
    private readonly clsService: ClsService<AppClsStore>,
  ) { }

  private getDefaultCostFromInput(input?: number | null): bigint | null {
    return input ? BigInt(input) : null;
  }

  private getDomainIdFromStore() {
    return this.clsService.get('domainId');
  }

  async createProduct(dto: CreateProductDto, domainId: string = this.getDomainIdFromStore()): Promise<ProductLoadedInfo> {
    const product = this.em.create(Product, {
      info: {
        name: dto.name,
        description: dto.description,
      },
      domain: this.em.getReference(Domain, domainId),
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
      },
    );

    this.em.assign(product, {
      info: {
        name: dto.name,
        description: dto.description,
      },
      currency: dto.currency,
      defaultCost: this.getDefaultCostFromInput(dto.defaultCost),
      trackInventory: dto.trackingInventory,
      status: dto.status,
    }, {
      ignoreUndefined: true
    });

    await this.em.populate(product, ['info']);
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
