import { DomainRepository } from '@/persistence/repositories/domain-repository';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { DomainNotFoundError } from '../errors/domain.error';

@Injectable()
export class DomainCache {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly domainRepo: DomainRepository,
  ) {}

  domainStatus(domainId: string) {
    const key = `domain:${domainId}:status`;

    const get = async (): Promise<boolean | undefined> => {
      return await this.cacheManager.get(key);
    };

    const set = async (value: boolean) => {
      await this.cacheManager.set(key, value);
    };

    return { get, set };
  }

  async getDomainStatusValue(domainId: string) {
    let status = await this.domainStatus(domainId).get();

    if (typeof status !== 'boolean') {
      const domain = await this.domainRepo.findOneOrFail(
        {
          id: domainId,
        },
        {
          fields: ['active'],
          failHandler: DomainNotFoundError,
        },
      );

      status = domain.active;
      await this.domainStatus(domainId).set(status);
    }

    return status;
  }
}
