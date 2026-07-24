import { DomainRepository } from '@/persistence/repositories/domain-repository';
import { Inject, Injectable } from '@nestjs/common';
import { CreateDomainMemberDto, UpdateDomainMemberDto } from '../dtos/domain-dto';
import { UserRepository } from '@/persistence/repositories/user-repository';
import { EntityManager } from '@mikro-orm/core';
import { DomainMember } from '@/persistence/entities/iam-domain.member.entity';
import { DomainMemberLoadedUser } from '@/persistence/types/domain-type';
import { authConfig } from '@/configs/auth.config';
import type { ConfigType } from '@nestjs/config';
import { DomainRole } from '@/persistence/entities/iam-domain.role.entity';

@Injectable()
export class DomainService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly domainRepo: DomainRepository,
    private readonly em: EntityManager,
    @Inject(authConfig.KEY) private readonly config: ConfigType<typeof authConfig>,
  ) {}

  async createMember(domainId: string, dto: CreateDomainMemberDto) {
    const domain = await this.domainRepo.findOneOrFail({
      id: domainId,
    });
    domain.ensureStatus();

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
    return member as DomainMemberLoadedUser;
  }

  async updateMember(userId: string, dto: UpdateDomainMemberDto) {
    const member = await this.em.findOneOrFail(
      DomainMember,
      {
        user: {
          id: userId,
        },
      },
      {
        populate: ['user.party', 'domain'],
      },
    );

    member.domain.getEntity().ensureStatus();

    this.em.assign(
      member,
      {
        role: dto.roleId,
      },
      {
        ignoreUndefined: true,
      },
    );

    this.em.assign(
      member,
      {
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
    return member;
  }
}
