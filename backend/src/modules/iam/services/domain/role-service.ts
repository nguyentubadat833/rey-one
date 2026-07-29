import { Inject, Injectable } from '@nestjs/common';
import { CreateDomainRoleDto, UpdateDomainRoleDto } from '../../dtos/domain-dto';
import { EntityManager } from '@mikro-orm/core';
import { DomainRoleLoadedMembers } from '@/persistence/types/domain-type';
import { authConfig } from '@/configs/auth.config';
import { DomainRole } from '@/persistence/entities/iam-domain.role.entity';
import { Domain } from '@/persistence/entities/iam-domain.entity';
import { ClsService } from 'nestjs-cls';
import { AppClsStore } from '@/utils/types/system';
import { DomainNotFound, DomainRoleNotFound } from '@/utils/errors/domain.error';
import type { ConfigType } from '@nestjs/config';

@Injectable()
export class DomainRoleService {
  constructor(
    private readonly clsService: ClsService<AppClsStore>,
    private readonly em: EntityManager,
    @Inject(authConfig.KEY) private readonly config: ConfigType<typeof authConfig>,
  ) {}

  private getDomainIdFromStore() {
    return this.clsService.get('domainId');
  }

  getRoleWithMembers(roleId: string): Promise<DomainRoleLoadedMembers> {
    return this.em.findOneOrFail(
      DomainRole,
      {
        id: roleId,
      },
      {
        populate: ['members.user.party'],
        failHandler: DomainRoleNotFound,
      },
    );
  }

  async createRole(dto: CreateDomainRoleDto, domainId: string = this.getDomainIdFromStore()) {
    const domain = await this.em.findOneOrFail(Domain, domainId, {
      failHandler: DomainNotFound,
    });

    // Middleware checked
    // domain.ensureStatus();

    const role = this.em.create(DomainRole, {
      domain,
      ...dto,
    });

    await this.em.flush();
    return role;
  }

  async updateRole(roleId: string, dto: UpdateDomainRoleDto) {
    const role = await this.em.findOneOrFail(DomainRole, roleId, {
      failHandler: DomainRoleNotFound,
    });

    // Middleware checked
    // role.domain.getEntity().ensureStatus();

    this.em.assign(role, dto, { ignoreUndefined: true });
    await this.em.flush();

    return role;
  }
}
