import { DomainRole } from '@/persistence/entities/iam-domain.role.entity';
import { RequireAuth, RequirePermission } from '@/utils/decorators/auth.decorator';
import { ApiDomainHeader } from '@/utils/decorators/utils.decorator';
import { EntityManager } from '@mikro-orm/core';
import { Body, Controller, NotFoundException, Param, Patch } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateDomainRoleDto } from '../../dtos/domain-dto';
import { DomainMapper } from '../../mappers/domain-mapper';

@RequireAuth()
@ApiTags('IAM / Domains / Roles')
@Controller()
export class DomainRoleController {
  constructor(private readonly em: EntityManager) {}

  @RequirePermission('domain:role:manage')
  @ApiDomainHeader()
  @ApiOperation({ summary: 'Update domain role' })
  @Patch(`roles/:roleId`)
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
