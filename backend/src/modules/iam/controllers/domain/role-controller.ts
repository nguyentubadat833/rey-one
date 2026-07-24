import { DomainRole } from '@/persistence/entities/iam-domain.role.entity';
import { RequireAuth, RequirePermission } from '@/utils/decorators/auth.decorator';
import { ApiDomainHeader, CurrentHeader } from '@/utils/decorators/utils.decorator';
import { EntityManager } from '@mikro-orm/core';
import { Body, Controller, Get, NotFoundException, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateDomainRoleDto, UpdateDomainRoleDto } from '../../dtos/domain-dto';
import { DomainMapper } from '../../mappers/domain-mapper';
import { DOMAIN_ID_HEADER } from '@/utils/types/utils';
import { Domain } from '@/persistence/entities/iam-domain.entity';

@RequireAuth()
@ApiDomainHeader()
@ApiTags('IAM / Domains / Roles')
@Controller('domain-roles')
export class DomainRoleController {
  constructor(private readonly em: EntityManager) {}

  @RequirePermission('domain:role:read')
  @ApiOperation({ summary: 'Domain roles' })
  @Get()
  async domainRoles(@CurrentHeader(DOMAIN_ID_HEADER) domainId: string) {
    return this.em
      .find(DomainRole, {
        domain: {
          id: domainId,
        },
      })
      .then((rs) => rs.map(DomainMapper.toDomainRoleView));
  }

  @RequirePermission('domain:role:manage')
  @ApiOperation({ summary: 'Add domain role' })
  @Post()
  async addDomainRole(@CurrentHeader(DOMAIN_ID_HEADER) domainId: string, @Body() dto: CreateDomainRoleDto) {
    const domain = await this.em.findOneOrFail(Domain, domainId, {
      failHandler: () => new NotFoundException(),
    });
    domain.ensureStatus();

    const role = this.em.create(DomainRole, {
      domain,
      ...dto,
    });

    await this.em.flush();
    return DomainMapper.toDomainRoleView(role);
  }

  @RequirePermission('domain:role:manage')
  @ApiOperation({ summary: 'Update domain role' })
  @Patch(':roleId')
  async updateDomainRole(@Param('roleId') roleId: string, @Body() dto: UpdateDomainRoleDto) {
    const role = await this.em.findOneOrFail(DomainRole, roleId, {
      failHandler: () => new NotFoundException(),
      populate: ['domain'],
    });
    role.domain.getEntity().ensureStatus();

    this.em.assign(role, dto, { ignoreUndefined: true });
    await this.em.flush();

    return DomainMapper.toDomainRoleView(role);
  }
}
