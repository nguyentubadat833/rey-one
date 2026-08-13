import { Domain } from '@/persistence/entities/domain.entity';
import { DomainRepository } from '@/persistence/repositories/domain-repository';
import { DomainObject } from '@/persistence/types/domain-type';
import { DomainNotFoundError } from '@/utils/errors/domain.error';
import { wrap } from '@mikro-orm/core';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class DomainService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly domainRepo: DomainRepository,
  ) {}

  async getDomainById(id: string) {
    const domainCacheObject = await this.cacheManager.get<DomainObject | undefined>(`domain::${id}`);

    let domainEntity: Domain

    if (!domainCacheObject) {
      domainEntity = await this.domainRepo.findOneOrFail(
        {
          id,
        },
        {
          failHandler: DomainNotFoundError,
        },
      );

      await this.cacheManager.set(`domain:${id}`, wrap(domainEntity).toObject());
    } else {
      domainEntity = this.domainRepo.merge(domainCacheObject);
    }

    return domainEntity
  }
}
