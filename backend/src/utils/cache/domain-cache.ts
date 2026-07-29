import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class DomainCache {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  status(domainId: string) {
    console.log(this.cacheManager.cacheId());
    const key = `domain:${domainId}:status`;

    const get = async (): Promise<boolean | undefined> => {
      return await this.cacheManager.get(key);
    };

    const set = async (value: boolean) => {
      await this.cacheManager.set(key, value);
    };

    return { get, set };
  }
}
