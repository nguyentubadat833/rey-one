import { EntityManager } from '@mikro-orm/core';
import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequireAdmin, RequireAuth, RequirePermission } from '@/utils/decorators/auth.decorator';
import { CreateDomainDto, UpdateDomainDto } from '../../dtos/domain-dto';
import { Domain } from '@/persistence/entities/iam-domain.entity';
import { DomainMapper } from '../../mappers/domain-mapper';
import { DOMAIN_ID_PARAMETER } from '@/utils/types/utils';
import { DomainSummary } from '@/persistence/entities/query-entities/domain-query';
import { DomainSummaryView, DomainSummariesView, DomainWithIAMView, DomainAvailableOption } from '@rey-one/shared';
import { DomainService } from '../../services/domain/domain-service';
import { DomainNotFoundError } from '@/utils/errors/domain.error';
import { PaginationQueryDto } from '@/utils/dtos/utils-dto';
import { ResponseMapper } from '@/utils/mappers/response-mapper';
import { CurrentUser } from '@/utils/decorators/utils.decorator';
import { DomainMember } from '@/persistence/entities/iam-domain-member.entity';
import type { UserAuth } from '@/utils/types/system';

@RequireAuth()
@ApiTags('IAM / Domains')
@Controller('domains')
export class DomainController {
  constructor(
    private readonly em: EntityManager,
    private readonly domainService: DomainService,
  ) {}

  // @ApiOperation({ summary: 'Domain available options' })
  // @Get('/options')
  // async getDomainAvailableOptions(@CurrentUser() user: UserAuth): Promise<DomainAvailableOption[]> {
  //   if (user.type === 'admin_user') {
  //     return await this.em
  //       .find(Domain, {
  //         active: true,
  //       })
  //       .then((domains) => domains.map(DomainMapper.toDomainOption));
  //   }

  //   const domains: Domain[] = await this.em
  //     .find(
  //       DomainMember,
  //       {
  //         user: user.id,
  //         domain: {
  //           active: true,
  //         },
  //       },
  //       {
  //         populate: ['domain'],
  //       },
  //     )
  //     .then((members) => members.map((item) => item.domain.getEntity()));
  //   return domains.map((item) => DomainMapper.toDomainOption(item));
  // }

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
      failHandler: DomainNotFoundError,
    });
    this.em.assign(domain, dto, { ignoreUndefined: true });

    await this.em.flush();
    return DomainMapper.toDomainView(domain);
  }

  @RequirePermission('domain:manage:read', false)
  @ApiOperation({ summary: 'Domain summary' })
  @Get(`:${DOMAIN_ID_PARAMETER}`)
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
