import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { DomainLoadedParty, DomainLoadedPartyAndRoles, DomainLoadedPartyAndRolesAndMembers } from '@/persistence/types/domain-type';
import { Domain } from '@/persistence/entities/iam-domain.entity';
import { ClsService } from 'nestjs-cls';
import { AppClsStore } from '@/utils/types/system';
import { DomainNotFoundError } from '@/utils/errors/domain.error';
import { DomainRepository } from '@/persistence/repositories/domain-repository';
import { UserDomainAccess } from '@rey-one/shared';
import { DomainMember } from '@/persistence/entities/iam-domain-member.entity';
import { DomainMapper } from '../../mappers/domain-mapper';
import { CreateDomainDto, UpdateDomainDto } from '../../dtos/domain-dto';

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

  async createDomain(dto: CreateDomainDto) {
    const domain = this.em.create(Domain, {
      party: {
        name: dto.name,
      },
      active: dto.active,
      permissions: dto.permissions,
    });

    await this.em.flush();
    return domain as DomainLoadedParty;
  }

  async updateDomain(id: string, dto: UpdateDomainDto) {
    const domain = await this.em.findOneOrFail(Domain, id, {
      failHandler: DomainNotFoundError,
      populate: ['party'],
    });

    this.em.assign(
      domain,
      {
        active: dto.active,
        permissions: dto.permissions,
        party: {
          name: dto.name,
        },
      },
      { ignoreUndefined: true },
    );

    await this.em.flush();
    return domain;
  }

  async getDomainDetailWithIAM(domainId: string = this.getDomainIdFromStore()): Promise<DomainLoadedPartyAndRolesAndMembers> {
    return this.domainRepo.findOneOrFail(
      {
        id: domainId,
      },
      {
        populate: ['party', 'roles', 'members.user.party'],
        failHandler: DomainNotFoundError,
      },
    );
  }

  async getUserAccessDomains(user = this.getActorFromStore()): Promise<UserDomainAccess[]> {
    const userId = user.id;
    const userType = user.type;

    if (userType === 'admin_user') {
      return await this.em
        .find(
          Domain,
          {
            active: true,
          },
          {
            populate: ['party'],
          },
        )
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
          populate: ['domain.party'],
        },
      )
      .then((rs) => rs.map(DomainMapper.memberToUserDomainAccess));
  }

  async getAvailableDomains(): Promise<DomainLoadedPartyAndRoles[]> {
    return await this.domainRepo.find(
      {
        active: true,
      },
      {
        populate: ['party', 'roles'],
      },
    );
  }
}
