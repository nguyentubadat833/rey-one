import { Injectable } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from '../dtos/product-dto';
import { EntityManager } from '@mikro-orm/core';
import { Product } from '@/persistence/entities/catalog-product.entity';
import { Domain } from '@/persistence/entities/iam-domain.entity';
import { AppError } from '@/utils/errors/app.error';

@Injectable()
export class ProductService {
  constructor(private readonly em: EntityManager) { }

  private getDefaultCostFromInput(input?: number | null): bigint | null {
    return input ? BigInt(input) : null
  }

  async createProduct(domainId: string, dto: CreateProductDto) {
    
    const product = this.em.create(Product, {
      info: {
        name: dto.name,
        description: dto.description,
      },
      owner: this.em.getReference(Domain, domainId),
      currency: dto.currency,
      defaultCost: this.getDefaultCostFromInput(dto.defaultCost),
      trackInventory: dto.trackingInventory,
      status: dto.status,
      type: dto.type,
    });

    await this.em.flush();
    return product;
  }

  async updateProduct(productId: string, dto: UpdateProductDto) {
    const product = await this.em.findOneOrFail(
      Product,
      { id: productId },
      {
        failHandler: () => AppError.withMessage('OBJECT_NOT_FOUND', "Product not found")
      }
    )

    this.em.assign(product, {
      info: {
        name: dto.name,
        description: dto.description
      },
      currency: dto.currency,
      defaultCost: this.getDefaultCostFromInput(dto.defaultCost),
      trackInventory: dto.trackingInventory,
      status: dto.status
    })
  }
}
