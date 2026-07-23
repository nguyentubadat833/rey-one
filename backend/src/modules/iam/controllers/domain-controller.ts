import { EntityManager } from '@mikro-orm/core';
import { Body, Controller, Get, NotFoundException, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequireAdmin, RequireAuth, RequirePermission } from '@/utils/decorators/auth.decorator';
import { CreateDomainDto, CreateDomainRoleDto, UpdateDomainDto, UpdateDomainRoleDto } from '../dtos/domain-dto';
import { Domain } from '@/persistence/entities/iam-domain.entity';
import { DomainMapper } from '../mappers/domain-mapper';
import { DOMAIN_ID_PARAMETER } from '@/utils/types/utils';
import { DomainRole } from '@/persistence/entities/iam-domain.role.entity';
import { ApiDomainHeader } from '@/utils/decorators/utils.decorator';
import { DomainRepository } from '@/persistence/repositories/domain-repository';

@RequireAuth()
@ApiTags('IAM / Domain')
@Controller('domain')
export class OrganizationController {
  constructor(
    private readonly em: EntityManager,
    private readonly domainRepo: DomainRepository,
  ) {}

  @RequireAdmin()
  @ApiOperation({ summary: 'Domain summaries' })
  @Get('summaries')
  async getSummaries() {
    return this.domainRepo.getSummaries();
  }

  @RequireAdmin()
  @ApiOperation({ summary: 'Create domain' })
  @Post()
  async createDomain(@Body() dto: CreateDomainDto) {
    const domain = this.em.create(Domain, dto);
    await this.em.flush();

    return DomainMapper.toDomainView(domain);
  }

  @RequireAdmin()
  @ApiOperation({ summary: 'Update domain' })
  @Patch(`:${DOMAIN_ID_PARAMETER}`)
  async updateDomain(@Param(DOMAIN_ID_PARAMETER) id: string, @Body() dto: UpdateDomainDto) {
    const domain = await this.em.findOneOrFail(Domain, id, {
      failHandler: () => new NotFoundException(),
    });
    this.em.assign(domain, dto, { ignoreUndefined: true });

    await this.em.flush();
    return DomainMapper.toDomainView(domain);
  }

  @RequirePermission('domain:manage:read')
  @ApiOperation({ summary: 'Get domain summary' })
  @Get(`:${DOMAIN_ID_PARAMETER}`)
  async getSummary(@Param(DOMAIN_ID_PARAMETER) id: string) {
    return this.domainRepo.getSummaryById(id);
  }

  @RequirePermission('domain:role:manage')
  @ApiOperation({ summary: 'Add domain role' })
  @Post(`:${DOMAIN_ID_PARAMETER}/roles`)
  async addDomainRole(@Param(DOMAIN_ID_PARAMETER) domainId: string, @Body() dto: CreateDomainRoleDto) {
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
