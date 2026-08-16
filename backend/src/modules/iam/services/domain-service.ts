import { Domain } from '@/persistence/entities/domain.entity';
import { DomainRepository } from '@/persistence/repositories/domain-repository';
import { DoaminLoadedInfoAndOwner, DomainObject } from '@/persistence/types/domain-type';
import { DomainNotFoundError } from '@/utils/errors/domain.error';
import { EntityManager, wrap } from '@mikro-orm/core';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { AuthService } from './auth-service';
import { ClsService } from 'nestjs-cls';
import { AppClsStore } from '@/utils/types/system';
import { AppError } from '@/utils/errors/app.error';
import { CreateDomainDto, UpdateDomainDto } from '../dtos/domain-dto';
import { Subscription } from '@/persistence/entities/subscription.entity';
import { User } from '@/persistence/entities/user.entity';
import { authConfig } from '@/configs/auth.config';
import type { ConfigType } from '@nestjs/config';
import { CreateUserDto } from '../dtos/user-dto';

@Injectable()
export class DomainService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly em: EntityManager,
    private readonly appStore: ClsService<AppClsStore>,
    private readonly domainRepo: DomainRepository,
    private readonly authService: AuthService,
    @Inject(authConfig.KEY) private readonly config: ConfigType<typeof authConfig>,
  ) { }

  getDomainIdFromContext() {
    const domainId = this.appStore.get('domainId')
    if (!domainId) {
      throw new AppError('MISSING_DOMAIN_CONTEXT')
    }
    return domainId
  }

  async getDomainFromContext() {
    const domainId = this.getDomainIdFromContext()

    return this.getDomainById(domainId)
  }

  async getDomainById(id: string, requireActive = false) {
    const domainCacheObject = await this.cacheManager.get<DomainObject | undefined>(`domain::${id}`);

    let domainEntity: Domain;

    if (!domainCacheObject) {
      domainEntity = await this.domainRepo.findOneOrFail(
        {
          id,
        },
        {
          failHandler: DomainNotFoundError,
        },
      );

      await this.cacheManager.set(`domain::${id}`, wrap(domainEntity).toObject());
    } else {
      domainEntity = this.domainRepo.merge(domainCacheObject);
    }

    if (requireActive) domainEntity.ensureActive();

    return domainEntity;
  }

  async createDomain(dto: CreateDomainDto) {
    const domain = this.domainRepo.create({
      subscription: {
        startedAt: dto.startedAt,
        plan: dto.plan
      },
      info: {
        name: dto.name,
        image: dto.image
      },
      owner: {
        email: dto.email,
        password: this.config.userDefault.password,
        info: {
          name: dto.name
        }
      }
    })

    this.em.assign(domain.owner, {
      domain
    })

    await this.em.flush()
    return domain as DoaminLoadedInfoAndOwner
  }

  async updateDomain(id: string, dto: UpdateDomainDto) {
    const domain = await this.domainRepo.findOneOrFail(
      { id },
      {
        populate: ['info', 'owner.info']
      }
    )

    this.domainRepo.assign(domain,
      {
        permissions: dto.permissions
      },
      {
        ignoreUndefined: true
      }
    )

    this.em.assign(domain.info,
      {
        name: dto.name,
        image: dto.image
      },
      {
        ignoreUndefined: true
      }
    )

    this.em.assign(domain.subscription,
      {
        expiresAt: dto.expiresAt,
        plan: dto.plan
      },
      {
        ignoreUndefined: true
      }
    )

    await this.em.flush()
    return domain as DoaminLoadedInfoAndOwner
  }
}
