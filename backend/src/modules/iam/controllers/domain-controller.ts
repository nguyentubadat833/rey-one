import { EntityManager } from '@mikro-orm/core';
import { Body, Controller, Get, NotFoundException, Param, Patch, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequireAdmin, RequireAuth, RequirePermission } from '@/utils/decorators/auth.decorator';
import { CreateDomainDto, UpdateDomainDto } from '../dtos/domain-dto';
import { Domain } from '@/persistence/entities/iam-domain.entity';
import { DomainMapper } from '../mappers/domain-mapper';
import { DOMAIN_ID_PARAM } from '@/utils/types/utils';
import { triggerAsyncId } from 'async_hooks';

@RequireAuth()
@ApiTags('IAM / Domain')
@Controller('domain')
export class OrganizationController {
  constructor(private readonly em: EntityManager) {}

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
  @Patch(`:${DOMAIN_ID_PARAM}`)
  async updateDomain(@Param(DOMAIN_ID_PARAM) id: string, @Body() dto: UpdateDomainDto) {
    const domain = await this.em.findOneOrFail(Domain, id, {
      failHandler: () => new NotFoundException()
    });
    this.em.assign(domain, dto, { ignoreUndefined: true });

    await this.em.flush();
    return DomainMapper.toDomainView(domain);
  }

  
}
