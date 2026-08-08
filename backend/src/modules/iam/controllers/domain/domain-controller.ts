import { EntityManager } from '@mikro-orm/core';
import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequireAdmin, RequireAuth, RequirePermission } from '@/utils/decorators/auth.decorator';
import { CreateDomainDto, UpdateDomainDto } from '../../dtos/domain-dto';
import { DomainMapper } from '../../mappers/domain-mapper';
import { DOMAIN_ID_PARAMETER } from '@/utils/types/utils';
import { DomainSummary } from '@/persistence/entities/query-entities/domain-query';
import { DomainSummaryView, DomainSummariesView, DomainWithIAMView, DomainWithRolesView } from '@rey-one/shared';
import { DomainService } from '../../services/domain/domain-service';
import { DomainNotFoundError } from '@/utils/errors/domain.error';
import { PaginationQueryDto } from '@/utils/dtos/utils-dto';
import { ResponseMapper } from '@/utils/mappers/response-mapper';

@RequireAuth()
@ApiTags('IAM / Domains')
@Controller('domains')
export class DomainController {
  constructor(
    private readonly em: EntityManager,
    private readonly domainService: DomainService,
  ) {}

  @RequireAdmin()
  @ApiOperation({ summary: 'Domain summaries' })
  @Get()
  async getSummaries(@Query() { limit, page }: PaginationQueryDto): Promise<DomainSummariesView> {
    const [data, total] = await this.em.findAndCount(
      DomainSummary,
      {},
      {
        limit,
        offset: (page - 1) * limit,
        orderBy: [
          {
            createdAt: 'DESC',
          },
        ],
      },
    );

    const domains = data.map((item) => DomainMapper.toDomainSummary(item));
    return ResponseMapper.toPaginatedResponse(domains, total, page, limit);
  }

  @RequirePermission('domain:manage:read')
  @ApiOperation({ summary: 'Available Domains' })
  @Get('/available')
  async availableDomains() {
    return await this.domainService.getAvailableDomains().then((rs) => rs.map((item) => DomainMapper.toDomainWithRolesView(item)));
  }

  @RequireAdmin()
  @ApiOperation({ summary: 'Create domain' })
  @Post()
  async createDomain(@Body() dto: CreateDomainDto) {
    const domain = await this.domainService.createDomain(dto);
    return DomainMapper.toDomainView(domain);
  }

  @RequireAdmin()
  @ApiOperation({ summary: 'Update domain' })
  @Patch(`:${DOMAIN_ID_PARAMETER}`)
  async updateDomain(@Param(DOMAIN_ID_PARAMETER) id: string, @Body() dto: UpdateDomainDto) {
    const domain = await this.domainService.updateDomain(id, dto);
    return DomainMapper.toDomainView(domain);
  }

  @RequirePermission('domain:manage:read')
  @ApiOperation({ summary: 'Domain info with roles' })
  @Get(`:${DOMAIN_ID_PARAMETER}`)
  async getInfo(@Param(DOMAIN_ID_PARAMETER) id: string): Promise<DomainWithRolesView> {
    return this.domainService.getDomainWithRoles(id).then(DomainMapper.toDomainWithRolesView);
  }

  @RequirePermission('domain:manage:read', false)
  @ApiOperation({ summary: 'Domain summary' })
  @Get(`:${DOMAIN_ID_PARAMETER}/summary`)
  async getSummary(@Param(DOMAIN_ID_PARAMETER) id: string): Promise<DomainSummaryView> {
    return this.em
      .findOneOrFail(
        DomainSummary,
        {
          id,
        },
        { failHandler: DomainNotFoundError },
      )
      .then((data) => DomainMapper.toDomainSummary(data));
  }

  @RequirePermission('domain:manage:read', false)
  @ApiOperation({ summary: 'Domain detail' })
  @Get(`:${DOMAIN_ID_PARAMETER}/detail`)
  async getDetail(@Param(DOMAIN_ID_PARAMETER) id: string): Promise<DomainWithIAMView> {
    return this.domainService.getDomainDetailWithIAM(id).then(DomainMapper.toDomainWithIAMView);
  }
}
