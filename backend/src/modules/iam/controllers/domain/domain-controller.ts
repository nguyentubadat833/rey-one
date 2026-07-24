import { EntityManager } from '@mikro-orm/core';
import { Body, Controller, Get, NotFoundException, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequireAdmin, RequireAuth, RequirePermission } from '@/utils/decorators/auth.decorator';
import { CreateDomainDto, UpdateDomainDto } from '../../dtos/domain-dto';
import { Domain } from '@/persistence/entities/iam-domain.entity';
import { DomainMapper } from '../../mappers/domain-mapper';
import { DOMAIN_ID_PARAMETER } from '@/utils/types/utils';
import { DomainSummary } from '@/persistence/queries/domain-query';

@RequireAuth()
@ApiTags('IAM / Domains')
@Controller('domains')
export class DomainController {
  constructor(private readonly em: EntityManager) {}

  @RequireAdmin()
  @ApiOperation({ summary: 'Domain summaries' })
  @Get('summaries')
  async getSummaries() {
    return this.em.findAll(DomainSummary);
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
  @ApiOperation({ summary: 'Domain summary' })
  @Get(`:${DOMAIN_ID_PARAMETER}`)
  async getSummary(@Param(DOMAIN_ID_PARAMETER) id: string) {
    return this.em.findOneOrFail(
      DomainSummary,
      {
        id,
      },
      { failHandler: () => new NotFoundException() },
    );
  }
}
