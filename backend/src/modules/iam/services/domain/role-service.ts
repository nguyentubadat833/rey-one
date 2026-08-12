import { Inject, Injectable } from '@nestjs/common';
import { CreateDomainRoleDto, UpdateDomainRoleDto } from '../../dtos/domain-dto';
import { EntityManager } from '@mikro-orm/core';
import { DomainRoleLoadedMembers } from '@/persistence/types/domain-type';
import { authConfig } from '@/configs/auth.config';
import { DomainRole } from '@/persistence/entities/role.entity';
import { Domain } from '@/persistence/entities/domain.entity';
import { ClsService } from 'nestjs-cls';
import { AppClsStore } from '@/utils/types/system';
import { DomainNotFoundError, DomainRoleNotFoundError } from '@/utils/errors/domain.error';
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

  async getInfoByIds(ids: string[]){
    return this.em.find(DomainRole, {
      id: {
        $in: ids
      }
    })
  }

  getRoleWithMembers(roleId: string): Promise<DomainRoleLoadedMembers> {
    return this.em.findOneOrFail(
      DomainRole,
      {
        id: roleId,
      },
      {
        populate: ['members.user.party'],
        failHandler: DomainRoleNotFoundError,
      },
    );
  }

  async createRole(dto: CreateDomainRoleDto, domainId: string = this.getDomainIdFromStore()) {
    const domain = await this.em.findOneOrFail(Domain, domainId, {
      failHandler: DomainNotFoundError,
    });

    const role = this.em.create(DomainRole, {
      domain,
      ...dto,
    });

    await this.em.flush();
    return role;
  }

  async updateRole(roleId: string, dto: UpdateDomainRoleDto) {
    const role = await this.em.findOneOrFail(DomainRole, roleId, {
      failHandler: DomainRoleNotFoundError,
    });

    this.em.assign(role, dto, { ignoreUndefined: true });
    await this.em.flush();

    return role;
  }
}
