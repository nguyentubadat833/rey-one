import { authConfig } from '@/configs/auth.config';
import { DomainRepository } from '@/persistence/repositories/domain-repository';
import { UserRepository } from '@/persistence/repositories/user-repository';
import { AppClsStore } from '@/utils/types/system';
import { EntityManager } from '@mikro-orm/core';
import { Inject, Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { CreateDomainMemberDto, UpdateDomainMemberDto } from '../../dtos/domain-dto';
import { DomainMemberNotFoundError, DomainNotFoundError } from '@/utils/errors/domain.error';
import { DomainRole } from '@/persistence/entities/iam-domain-role.entity';
import { DomainMember } from '@/persistence/entities/iam-domain-member.entity';
import { DomainMemberLoadedDomain, DomainMemberLoadedUserAndRole, DomainMemberLoadedUserAndRoleAndDomain } from '@/persistence/types/domain-type';
import type { ConfigType } from '@nestjs/config';

@Injectable()
export class DomainMemberService {
  constructor(
    private readonly clsService: ClsService<AppClsStore>,
    private readonly userRepo: UserRepository,
    private readonly domainRepo: DomainRepository,
    private readonly em: EntityManager,
    @Inject(authConfig.KEY) private readonly config: ConfigType<typeof authConfig>,
  ) { }

  private getDomainIdFromStore() {
    return this.clsService.get('domainId');
  }

  private getActorIdFromStore() {
    return this.clsService.get('actor.id')
  }

  async createMember(dto: CreateDomainMemberDto, domainId: string = this.getDomainIdFromStore()) {
    const domain = await this.domainRepo.findOneOrFail(
      {
        id: domainId,
      },
      {
        failHandler: DomainNotFoundError,
      },
    );

    // Middleware checked
    // domain.ensureStatus();

    const role = dto.roleId ? this.em.getReference(DomainRole, dto.roleId) : null;
    const member = this.em.create(DomainMember, {
      role,
      domain,
      user: this.userRepo.create({
        username: dto.username,
        email: dto.email,
        phone: dto.phone,
        password: dto.password ?? this.config.domain.member.password.default,
        party: {
          name: dto.name,
        },
        type: 'domain_user',
      }),
    });

    domain.members.add(member);
    await this.domainRepo.save(domain);

    if (role) {
      await this.em.populate(member, ['role']);
    }

    return member as DomainMemberLoadedUserAndRole;
  }

  async updateMember(userId: string, dto: UpdateDomainMemberDto) {
    const member = await this.em.findOneOrFail(
      DomainMember,
      {
        user: userId,
      },
      {
        populate: ['user.party'],
        failHandler: DomainMemberNotFoundError,
      },
    );

    // Middleware checked
    // member.domain.getEntity().ensureStatus();

    this.em.assign(
      member,
      {
        role: dto.roleId,
        user: {
          username: dto.username,
          email: dto.email,
          phone: dto.phone,
          password: dto.password,
          status: dto.status,
          party: {
            name: dto.name,
          },
        },
      },
      {
        ignoreUndefined: true,
      },
    );

    await this.em.flush();
    return member as DomainMemberLoadedUserAndRole;
  }

  async getMembers(domainId: string = this.getDomainIdFromStore()): Promise<DomainMemberLoadedUserAndRole[]> {
    return this.em.find(
      DomainMember,
      {
        domain: domainId,
      },
      {
        populate: ['user.party', 'role'],
      },
    );
  }

  async getMembersByUser(userId: string = this.getActorIdFromStore()): Promise<DomainMemberLoadedDomain[]> {
    return this.em.find(DomainMember,
      {
        user: userId,
        domain: {
          active: true
        }
      },
      {
        populate: ['domain']
      }
    )
  }

  getDomainMemberDetail(userId: string): Promise<DomainMemberLoadedUserAndRoleAndDomain> {
    return this.em.findOneOrFail(
      DomainMember,
      {
        user: userId,
      },
      {
        populate: ['user.party', 'domain'],
        failHandler: DomainMemberNotFoundError,
      },
    );
  }
}
