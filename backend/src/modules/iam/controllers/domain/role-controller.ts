import { DomainRole } from '@/persistence/entities/iam-domain-role.entity';
import { RequireAuth, RequirePermission } from '@/utils/decorators/auth.decorator';
import { ApiDomainHeader } from '@/utils/decorators/utils.decorator';
import { EntityManager } from '@mikro-orm/core';
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateDomainRoleDto, UpdateDomainRoleDto } from '../../dtos/domain-dto';
import { DomainMapper } from '../../mappers/domain-mapper';
import { DomainRoleService } from '../../services/domain/role-service';

@RequireAuth()
@ApiDomainHeader()
@ApiTags('IAM / Domains / Roles')
@Controller('domain-roles')
export class DomainRoleController {
  constructor(
    private readonly em: EntityManager,
    private readonly roleService: DomainRoleService,
  ) {}

  @RequirePermission('domain:role:read', false)
  @ApiOperation({ summary: 'Domain roles' })
  @Get()
  async domainRoles() {
    return this.em.find(DomainRole, {}).then((rs) => rs.map(DomainMapper.toDomainRoleView));
  }

  @RequirePermission('domain:role:manage')
  @ApiOperation({ summary: 'Add domain role' })
  @Post()
  async addDomainRole(@Body() dto: CreateDomainRoleDto) {
    const roleCreated = await this.roleService.createRole(dto);
    return DomainMapper.toDomainRoleView(roleCreated);
  }

  @RequirePermission('domain:role:manage')
  @ApiOperation({ summary: 'Update domain role' })
  @Patch(':roleId')
  async updateDomainRole(@Param('roleId') roleId: string, @Body() dto: UpdateDomainRoleDto) {
    const roleUpdated = await this.roleService.updateRole(roleId, dto);
    return DomainMapper.toDomainRoleView(roleUpdated);
  }

  @RequirePermission('domain:manage:read', false)
  @ApiOperation({ summary: 'Domain role detail' })
  @Get(':roleId')
  async getDomainRoleDetail(@Param('roleId') roleId: string) {
    return this.roleService.getRoleWithMembers(roleId).then(DomainMapper.toDomainRoleWithMembers);
  }
}
