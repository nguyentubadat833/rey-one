import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { DomainLoadedRoles, DomainLoadedRolesAndMembers } from '@/persistence/types/domain-type';
import { Domain } from '@/persistence/entities/iam-domain.entity';
import { ClsService } from 'nestjs-cls';
import { AppClsStore } from '@/utils/types/system';
import { DomainNotFoundError } from '@/utils/errors/domain.error';
import { DomainRepository } from '@/persistence/repositories/domain-repository';
import { UserDomainAccess } from '@rey-one/shared';
import { DomainMember } from '@/persistence/entities/iam-domain-member.entity';
import { DomainMapper } from '../../mappers/domain-mapper';

@Injectable()
export class DomainService {
  constructor(
    private readonly clsService: ClsService<AppClsStore>,
    private readonly em: EntityManager,
    private readonly domainRepo: DomainRepository,
    // private readonly domainCache: DomainCache,
  ) {}

  private getDomainIdFromStore() {
    return this.clsService.get('domainId');
  }

  private getActorFromStore() {
    return this.clsService.get('actor');
  }

  async getDomainDetailWithIAM(domainId: string = this.getDomainIdFromStore()): Promise<DomainLoadedRolesAndMembers> {
    return this.domainRepo.findOneOrFail(
      {
        id: domainId,
      },
      {
        populate: ['roles', 'members.user.party'],
        failHandler: DomainNotFoundError,
      },
    );
  }

  async getUserAccessDomains(user = this.getActorFromStore()): Promise<UserDomainAccess[]> {
    const userId = user.id;
    const userType = user.type;

    if (userType === 'admin_user') {
      return await this.em
        .find(Domain, {
          active: true,
        })
        .then((rs) => rs.map(DomainMapper.toUserDomainAccess));
    }

    return await this.em
      .find(
        DomainMember,
        {
          user: userId,
          domain: {
            active: true,
          },
        },
        {
          populate: ['domain'],
        },
      )
      .then((rs) => rs.map(DomainMapper.memberToUserDomainAccess));
  }

  async getAvailableDomains(): Promise<DomainLoadedRoles[]> {
    return await this.domainRepo.find(
      {
        active: true,
      },
      {
        populate: ['roles']
      },
    )
  }
}
