import { Role } from '@/persistence/entities/role.entity';
import { AppClsStore } from '@/utils/types/system';
import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { CreateRoleDto, UpdateRoleDto } from '../dtos/role-dto';
import { DomainService } from './domain-service';
import { RoleNotFoundError } from '@/utils/errors/user.error';
import { AuthService } from './auth-service';

@Injectable()
export class RoleService {
  constructor(
    private readonly em: EntityManager,
    private readonly domainService: DomainService,
    private readonly authService: AuthService
  ) {}

  async createRole(data: CreateRoleDto, domainId?: string) {
    const role = this.em.create(Role, {
        ...data,
        domain: domainId ? await this.domainService.getDomainById(domainId, true) : undefined
    })
    await this.em.flush()

    return role
  }

  async updateRole(id: string, data: UpdateRoleDto){

    const role = await this.em.findOneOrFail(Role, 
        { id },
        {
            failHandler: RoleNotFoundError,
            populate: ['domain']
        }
    )

    this.domainService.ensureAccessDomain(role.domain?.getEntity())
  }
}
