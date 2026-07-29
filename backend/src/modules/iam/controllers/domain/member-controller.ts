import { RequireAuth, RequirePermission } from '@/utils/decorators/auth.decorator';
import { ApiDomainHeader } from '@/utils/decorators/utils.decorator';
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateDomainMemberDto, UpdateDomainMemberDto } from '../../dtos/domain-dto';
import { DomainMapper } from '../../mappers/domain-mapper';
import { DomainMemberView } from '@rey-one/shared';
import { DomainMemberService } from '../../services/domain/member-service';

@RequireAuth()
@ApiDomainHeader()
@ApiTags('IAM / Domains / Members')
@Controller('domain-members')
export class DomainMemberController {
  constructor(private readonly memberService: DomainMemberService) {}

  @RequirePermission('domain:member:read', false)
  @ApiOperation({ summary: 'Domain members' })
  @Get()
  async members(): Promise<DomainMemberView[]> {
    return this.memberService.getMembers().then((rs) => rs.map(DomainMapper.toDomainMemberView));
  }

  @RequirePermission('domain:member:manage')
  @ApiOperation({ summary: 'Create domain member' })
  @Post()
  async createMember(@Body() dto: CreateDomainMemberDto) {
    const member = await this.memberService.createMember(dto);
    return DomainMapper.toDomainMemberView(member);
  }

  @RequirePermission('domain:member:manage')
  @ApiOperation({ summary: 'Update domain member' })
  @Patch(':id')
  async updateMember(@Param('id') memberId: string, @Body() dto: UpdateDomainMemberDto) {
    const member = await this.memberService.updateMember(memberId, dto);
    return DomainMapper.toDomainMemberView(member);
  }

  @RequirePermission('domain:member:read', false)
  @ApiOperation({ summary: 'Domain member detail' })
  @Get(':id')
  async getMemberDetail(@Param('id') memberId: string) {
    return this.memberService.getDomainMemberDetail(memberId).then(DomainMapper.toDomainMemberDetailView);
  }
}
