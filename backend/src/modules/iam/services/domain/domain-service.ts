import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { DomainLoadedRolesAndMembers } from '@/persistence/types/domain-type';
import { Domain } from '@/persistence/entities/iam-domain.entity';
import { ClsService } from 'nestjs-cls';
import { AppClsStore } from '@/utils/types/system';
import { DomainNotFoundError } from '@/utils/errors/domain.error';
import { DomainRepository } from '@/persistence/repositories/domain-repository';
import { DomainCache } from '@/utils/cache/domain-cache';

@Injectable()
export class DomainService {
  constructor(
    private readonly clsService: ClsService<AppClsStore>,
    private readonly em: EntityManager,
    private readonly domainRepo: DomainRepository,
    private readonly domainCache: DomainCache,
  ) {}

  private getDomainIdFromStore() {
    return this.clsService.get('domainId');
  }

  async getDomainDetailWithIAM(domainId: string = this.getDomainIdFromStore()): Promise<DomainLoadedRolesAndMembers> {
    return this.em.findOneOrFail(
      Domain,
      {
        id: domainId,
      },
      {
        populate: ['roles', 'members.user.party'],
        failHandler: DomainNotFoundError,
      },
    );
  }
}
