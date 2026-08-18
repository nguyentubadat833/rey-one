import { EntityManager } from '@mikro-orm/core';
import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequireAuth, RequireDomainPermission, RequireSystemPermission } from '@/utils/decorators/auth.decorator';
import { DomainService } from '../services/domain-service';
import {
  CreateDomainDto,
  CreateDomainMemberDto,
  DomainAvailableDto,
  DomainDto,
  DomainUserDto,
  UpdateDomainDto,
  UpdateDomainMemberDto,
} from '../dtos/domain-dto';
import { DomainMapper } from '../mappers/domain-mapper';
import { PaginationQueryDto } from '@/utils/dtos/utils-dto';
import { ResponseMapper } from '@/utils/mappers/response-mapper';
import { Domain } from '@/persistence/entities/domain.entity';
import { UserSummariesDto, UserSummaryDto } from '../dtos/user-dto';
import { DOMAIN_ID_PARAMETER } from '@/utils/types/utils';
import { ApiDomainHeader, CurrentUser } from '@/utils/decorators/utils.decorator';
import { UserMapper } from '../mappers/user-mapper';
import { PaginatedResponse } from '@rey-one/shared';
import { User } from '@/persistence/entities/user.entity';
import { UserLoadedInfoAndDomain } from '@/persistence/types/user-type';
import { UserNotFoundError } from '@/utils/errors/user.error';
import { DomainLoadedInfo } from '@/persistence/types/domain-type';

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

  @RequireSystemPermission('domain@read')
  @ApiOperation({ summary: 'Available Domains' })
  @ApiOkResponse({
    type: DomainAvailableDto,
    isArray: true
  })
  @Get('/available')
  async availableDomains() {
    const domains = await this.em.find(
      Domain,
      {
        $or: [{ subscription: { expiresAt: null } }, { subscription: { expiresAt: { $gt: new Date() } } }],
      },
      {
        populate: ['info'],
      },
    );
    return domains.map((item) => DomainMapper.domainToDomainAvailableDto(item));
  }

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

  @RequireSystemPermission('domain@read')
  @ApiOperation({ summary: 'Get domain' })
  @ApiOkResponse({
    type: DomainDto,
  })
  @Get(`:${DOMAIN_ID_PARAMETER}`)
  async getDomain(@Param(DOMAIN_ID_PARAMETER) id: string) {
    const domain = await this.domainService.getDomainById(id);
    await this.em.populate(domain, ['info', 'owner.info']);
    return DomainMapper.toDomain(domain);
  }

  @RequireDomainPermission('manage@read')
  @ApiDomainHeader()
  @ApiOperation({ summary: 'Get domain information' })
  @ApiOkResponse({
    type: DomainDto,
  })
  @Get('/info')
  async getMyDomain() {
    const domainId = this.domainService.getDomainIdFromContext();
    const domain = await this.domainService.getDomainById(domainId);

    await this.em.populate(domain, ['info', 'owner.info']);
    return DomainMapper.toDomain(domain);
  }

  @RequireDomainPermission('base@read', true)
  @ApiOperation({ summary: 'My available domain' })
  @ApiOkResponse({
    type: DomainAvailableDto,
    nullable: true
  })
  @Get('/my-available')
  async myAvailableDomains(@CurrentUser('id') myId: string) {
    const user = await this.em.findOneOrFail(User, 
      {
        id: myId
      },
      {
        failHandler: UserNotFoundError,
        populate: ['domain.info']
      }
    )

    if(!user.domain) return null
    return DomainMapper.domainToDomainAvailableDto(user.domain.getEntity())
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

  @RequireDomainPermission('member@create', true)
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

  @RequireDomainPermission('member@update', true)
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

  @RequireDomainPermission('member@read')
  @ApiDomainHeader()
  @ApiOperation({ summary: 'Get domain member' })
  @ApiOkResponse({
    type: DomainUserDto,
  })
  @Get('/members/:memberId')
  async getMember(@Param('memberId') memberId: string) {
    const member = await this.domainService.getDomainUserById(memberId);
    await this.em.populate(member, ['domain.info', 'info']);
    return UserMapper.toDomainUser(member as UserLoadedInfoAndDomain);
  }
}
