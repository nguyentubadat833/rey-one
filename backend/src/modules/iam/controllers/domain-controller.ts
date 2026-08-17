import { EntityManager } from '@mikro-orm/core';
import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequireAuth, RequireDomainPermission, RequireSystemPermission } from '@/utils/decorators/auth.decorator';
import { DomainService } from '../services/domain-service';
import { CreateDomainDto, CreateDomainMemberDto, DomainDto, DomainUserDto, UpdateDomainDto, UpdateDomainMemberDto } from '../dtos/domain-dto';
import { DomainMapper } from '../mappers/domain-mapper';
import { PaginationQueryDto } from '@/utils/dtos/utils-dto';
import { ResponseMapper } from '@/utils/mappers/response-mapper';
import { Domain } from '@/persistence/entities/domain.entity';
import { UserSummariesDto, UserSummaryDto } from '../dtos/user-dto';
import { DOMAIN_ID_PARAMETER } from '@/utils/types/utils';
import { ApiDomainHeader } from '@/utils/decorators/utils.decorator';
import { UserMapper } from '../mappers/user-mapper';
import { PaginatedResponse } from '@rey-one/shared';
import { User } from '@/persistence/entities/user.entity';

@RequireAuth()
@ApiTags('IAM / Domains')
@Controller('domains')
export class DomainController {
  constructor(
    private readonly em: EntityManager,
    private readonly domainService: DomainService,
  ) {}

  @RequireSystemPermission('domain@read')
  @ApiOperation({ summary: 'Domain summaries' })
  @ApiOkResponse({
    type: UserSummariesDto,
  })
  @Get()
  async getSummaries(@Query() { limit, page }: PaginationQueryDto) {
    const [data, total] = await this.em.findAndCount(
      Domain,
      {},
      {
        populate: ['info', 'owner.info'],
        limit,
        offset: (page - 1) * limit,
        orderBy: [
          {
            createdAt: 'DESC',
          },
        ],
      },
    );

    const domains = data.map((item) => DomainMapper.domainToDomainSummary(item));
    return ResponseMapper.toPaginatedResponse(domains, total, page, limit);
  }

  // @RequirePermission('domain:manage:read')
  // @ApiOperation({ summary: 'Available Domains' })
  // @Get('/available')
  // async availableDomains() {
  //   return await this.domainService.getAvailableDomains().then((rs) => rs.map((item) => DomainMapper.toDomainWithRolesView(item)));
  // }

  @RequireSystemPermission('domain@create')
  @ApiOperation({ summary: 'Create domain' })
  @ApiOkResponse({
    type: DomainDto,
  })
  @Post()
  async createDomain(@Body() dto: CreateDomainDto) {
    const domain = await this.domainService.createDomain(dto);
    return DomainMapper.toDomain(domain);
  }

  @RequireSystemPermission('domain@update')
  @ApiOperation({ summary: 'Update domain' })
  @ApiOkResponse({
    type: DomainDto,
  })
  @Patch(`:${DOMAIN_ID_PARAMETER}`)
  async updateDomain(@Param(DOMAIN_ID_PARAMETER) id: string, @Body() dto: UpdateDomainDto) {
    const domain = await this.domainService.updateDomain(id, dto);
    return DomainMapper.toDomain(domain);
  }

  @RequireDomainPermission('member@read')
  @ApiDomainHeader()
  @ApiOperation({ summary: 'Domain members' })
  @ApiOkResponse({
    type: UserSummariesDto,
  })
  @Get('/members')
  async summaries(@Query() { limit, page }: PaginationQueryDto): Promise<PaginatedResponse<UserSummaryDto>> {
    const [data, total] = await this.em.findAndCount(
      User,
      {
        domain: this.domainService.getDomainIdFromContext(),
      },
      {
        limit,
        offset: (page - 1) * limit,
        orderBy: [
          {
            createdAt: 'desc',
          },
        ],
        populate: ['info'],
      },
    );

    const users = data.map((item) => UserMapper.toUserSummary(item));
    return ResponseMapper.toPaginatedResponse(users, total, page, limit);
  }

  @RequireDomainPermission('member@create')
  @ApiDomainHeader()
  @ApiOperation({ summary: 'Add domain member' })
  @ApiOkResponse({
    type: DomainUserDto,
  })
  @Post('/members')
  async addMember(@Body() dto: CreateDomainMemberDto) {
    const member = await this.domainService.addMember(dto);
    return UserMapper.toDomainUser(member);
  }

  @RequireDomainPermission('member@update')
  @ApiDomainHeader()
  @ApiOperation({ summary: 'Update domain member' })
  @ApiOkResponse({
    type: DomainUserDto,
  })
  @Patch('/members/:memberId')
  async updateMember(@Param('memberId') memberId: string, @Body() dto: UpdateDomainMemberDto) {
    const member = await this.domainService.updateMember(memberId, dto);
    return UserMapper.toDomainUser(member);
  }
}
