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
import { PaginationQueryDto } from '@/utils/dtos/utils-dto';
import { ResponseMapper } from '@/utils/mappers/response-mapper';
import { DomainMemberView, PaginatedResponse } from '@rey-one/shared';
import { DomainMapper } from '../../mappers/domain-mapper';
import { User } from '@/persistence/entities/iam-user.entity';

@Injectable()
export class DomainMemberService {
  constructor(
    private readonly clsService: ClsService<AppClsStore>,
    private readonly userRepo: UserRepository,
    private readonly domainRepo: DomainRepository,
    private readonly em: EntityManager,
    @Inject(authConfig.KEY) private readonly config: ConfigType<typeof authConfig>,
  ) {}

  private getDomainIdFromStore() {
    return this.clsService.get('domainId');
  }

  private getActorFromStore() {
    return this.clsService.get('actor');
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
          code: User.generatePartyCode(),
          name: dto.name,
        },
        type: 'domain_user',
      }),
    });

    await this.em.flush();

    if (role) {
      await this.em.populate(member, ['role']);
    }

    console.log(member);

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
      },
      {
        ignoreUndefined: true,
      },
    );

    const user = member.user.getEntity();
    this.em.assign(
      user,
      {
        username: dto.username,
        email: dto.email,
        phone: dto.phone,
        password: dto.password,
        status: dto.status,
      },
      {
        ignoreUndefined: true,
      },
    );

    const party = user.party.getEntity();
    this.em.assign(
      party,
      {
        name: dto.name,
      },
      {
        ignoreUndefined: true,
      },
    );

    await this.em.flush();
    return member as DomainMemberLoadedUserAndRole;
  }

  async getMembers({ limit, page }: PaginationQueryDto, domainId: string = this.getDomainIdFromStore()): Promise<PaginatedResponse<DomainMemberView>> {
    const [data, total] = await this.em.findAndCount(
      DomainMember,
      {
        // domain: domainId,
        user: {
          type: 'domain_user',
        },
      },
      {
        limit,
        offset: (page - 1) * limit,
        orderBy: [
          {
            createdAt: 'desc',
          },
        ],
        populate: ['user.party', 'role'],
      },
    );
    return ResponseMapper.toPaginatedResponse(
      data.map((item) => DomainMapper.toDomainMemberView(item)),
      total,
      page,
      limit,
    );
  }

  async getMembersByUser(user = this.getActorFromStore()): Promise<DomainMemberLoadedDomain[]> {
    const userId = user.id;

    return this.em.find(
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
    );
  }

  getDomainMemberDetail(userId: string): Promise<DomainMemberLoadedUserAndRoleAndDomain> {
    return this.em.findOneOrFail(
      DomainMember,
      {
        user: userId,
      },
      {
        populate: ['user.party', 'domain.party'],
        failHandler: DomainMemberNotFoundError,
      },
    );
  }
}
