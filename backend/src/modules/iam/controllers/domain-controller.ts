import { EntityManager } from '@mikro-orm/core';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequireAdmin, RequireAuth, RequirePermission } from '@/utils/decorators/auth.decorator';

@RequireAuth()
@ApiTags('IAM / Domain')
@Controller('domain')
export class OrganizationController {
  constructor(
    private readonly em: EntityManager
  ) {}

  // @RequireAdmin()
  // @ApiOperation({ summary: 'Create domain' })
  // @Post()
  // async createDomain(@Body() dto: DomainInputDto) {
  //   const domain = this.em.create(Domain, dto);

    
    
  // }
}
