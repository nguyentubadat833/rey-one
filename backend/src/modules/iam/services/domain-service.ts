import { Domain } from '@/persistence/entities/domain.entity';
import { DomainRepository } from '@/persistence/repositories/domain-repository';
import { DomainObject } from '@/persistence/types/domain-type';
import { DomainNotFoundError } from '@/utils/errors/domain.error';
import { AppClsStore } from '@/utils/types/system';
import { wrap } from '@mikro-orm/core';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { AuthService } from './auth-service';
import { AppError } from '@/utils/errors/app.error';

@Injectable()
export class DomainService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly domainRepo: DomainRepository,
    private readonly authService: AuthService,
    private readonly appStore: ClsService<AppClsStore>
  ) {}

  ensureAccessDomain(domain: Domain | null){
    const isAdmin = this.authService.isActorAdmin()
    if(isAdmin) return
  }

  async getDomainById(id: string, requireActive = false) {
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

    if(requireActive) domainEntity.ensureActive()

    return domainEntity
  }
}
