import { Injectable } from '@nestjs/common';
import { CreateProductDto } from '../dtos/product-dto';
import { EntityManager } from '@mikro-orm/core';
import { Product } from '@/persistence/entities/catalog-product.entity';
import { Domain } from '@/persistence/entities/iam-domain.entity';

@Injectable()
export class ProductService {
  constructor(private readonly em: EntityManager) {}

  async createProduct(domainId: string, dto: CreateProductDto) {
    const product = this.em.create(Product, {
      info: {
        name: dto.name,
        description: dto.description,
      },
      owner: this.em.getReference(Domain, domainId),
      currency: dto.currency,
      defaultCost: BigInt(dto.defaultCost),
      status: dto.status,
      type: dto.type,
    });

    await this.em.flush();
    return product;
  }
}
