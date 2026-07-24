import { RequireAuth, RequirePermission } from '@/utils/decorators/auth.decorator';
import { ApiDomainHeader, CurrentHeader } from '@/utils/decorators/utils.decorator';
import { DOMAIN_ID_HEADER } from '@/utils/types/utils';
import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateDomainMemberDto, UpdateDomainMemberDto } from '../../dtos/domain-dto';
import { DomainService } from '../../services/domain-service';
import { DomainMapper } from '../../mappers/domain-mapper';

@RequireAuth()
@ApiDomainHeader()
@ApiTags('IAM / Domains / Members')
@Controller('domain-members')
export class DomainMemberController {
  constructor(private readonly domainService: DomainService) {}

  @RequirePermission('domain:member:manage')
  @ApiOperation({ summary: 'Create domain member' })
  @Post()
  async createMember(@CurrentHeader(DOMAIN_ID_HEADER) domainId: string, @Body() dto: CreateDomainMemberDto) {
    const member = await this.domainService.createMember(domainId, dto);
    return DomainMapper.toDomainMemberView(member);
  }

  @RequirePermission('domain:member:manage')
  @ApiOperation({ summary: 'Update domain member' })
  @Patch(':id')
  async updateMember(@Param('id') memberId: string, @Body() dto: UpdateDomainMemberDto) {
    const member = await this.domainService.updateMember(memberId, dto);
    return DomainMapper.toDomainMemberView(member);
  }
}
