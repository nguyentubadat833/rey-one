import { DomainRepository } from '@/persistence/repositories/domain-repository';
import { Inject, Injectable } from '@nestjs/common';
import { CreateDomainMemberDto, CreateDomainRoleDto, UpdateDomainMemberDto, UpdateDomainRoleDto } from '../dtos/domain-dto';
import { UserRepository } from '@/persistence/repositories/user-repository';
import { EntityManager } from '@mikro-orm/core';
import { DomainMember } from '@/persistence/entities/iam-domain.member.entity';
import {
  DomainLoadedRolesAndMembers,
  DomainMemberLoadedUserAndRole,
  DomainMemberLoadedUserAndRoleAndDomain,
  DomainRoleLoadedMembers,
} from '@/persistence/types/domain-type';
import { authConfig } from '@/configs/auth.config';
import { DomainRole } from '@/persistence/entities/iam-domain.role.entity';
import { AppError } from '@/utils/errors/app.error';
import { Domain } from '@/persistence/entities/iam-domain.entity';
import type { ConfigType } from '@nestjs/config';
import { ClsService } from 'nestjs-cls';
import { AppClsStore } from '@/utils/types/system';

@Injectable()
export class DomainService {
  constructor(
    private readonly clsService: ClsService<AppClsStore>,
    private readonly userRepo: UserRepository,
    private readonly domainRepo: DomainRepository,
    private readonly em: EntityManager,
    @Inject(authConfig.KEY) private readonly config: ConfigType<typeof authConfig>,
  ) {}

  private getDomainId() {
    return this.clsService.get('domainId');
  }

  async createMember(dto: CreateDomainMemberDto, domainId: string = this.getDomainId()) {
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

    if (role) {
      await this.em.populate(member, ['role']);
    }

    return member as DomainMemberLoadedUserAndRole;
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

  async getMembers(domainId: string = this.getDomainId()): Promise<DomainMemberLoadedUserAndRole[]> {
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

  async getDomainDetailWithIAM(domainId: string = this.getDomainId()): Promise<DomainLoadedRolesAndMembers> {
    return this.em.findOneOrFail(
      Domain,
      {
        id: domainId,
      },
      {
        populate: ['roles', 'members.user.party'],
        failHandler: () => new AppError('OBJECT_NOT_FOUND', 'Domain not found'),
      },
    );
  }

  getDomainRoleWithMembers(roleId: string): Promise<DomainRoleLoadedMembers> {
    return this.em.findOneOrFail(
      DomainRole,
      {
        id: roleId,
      },
      {
        failHandler: () => new AppError('OBJECT_NOT_FOUND', 'Domain role not found'),
        populate: ['members.user.party'],
      },
    );
  }

  getDomainMemberDetail(userId: string): Promise<DomainMemberLoadedUserAndRoleAndDomain> {
    return this.em.findOneOrFail(
      DomainMember,
      {
        user: {
          id: userId,
        },
      },
      {
        failHandler: () => AppError.withMessage('OBJECT_NOT_FOUND', 'Domain member not found'),
        populate: ['user.party', 'domain'],
      },
    );
  }

  async createRole(dto: CreateDomainRoleDto, domainId: string = this.getDomainId()) {
    const domain = await this.em.findOneOrFail(Domain, domainId, {
      failHandler: () => AppError.withMessage('OBJECT_NOT_FOUND', 'Domain not found'),
    });
    domain.ensureStatus();

    const role = this.em.create(DomainRole, {
      domain,
      ...dto,
    });

    await this.em.flush();
    return role;
  }

  async updateRole(roleId: string, dto: UpdateDomainRoleDto) {
    const role = await this.em.findOneOrFail(DomainRole, roleId, {
      failHandler: () => new AppError('OBJECT_NOT_FOUND', 'Role not found'),
      populate: ['domain'],
    });

    role.domain.getEntity().ensureStatus();

    this.em.assign(role, dto, { ignoreUndefined: true });
    await this.em.flush();

    return role;
  }
}
