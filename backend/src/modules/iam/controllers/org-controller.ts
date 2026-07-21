import { EntityManager } from '@mikro-orm/core';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequireAuth, RequirePermission } from '@/utils/decorators/auth.decorator';
import { UserRepository } from '@/persistence/repositories/user-repository';

@RequireAuth()
@ApiTags('IAM / Organizations')
@Controller('organizations')
export class OrganizationController {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly em: EntityManager,
  ) {}

  // @RequirePermission('organization:manage:read')
  // @Get()
  // async getOrgs() {
  //   const orgs = await this.userRepo.findOrganizations().then((items) => items.map((item) => UserMapper.toOrganizationResponse(item)));

  //   return {
  //     data: orgs,
  //   };
  // }

  // @RequirePermission('organization:manage')
  // @Post()
  // async createOrg(@Body() dto: OrgInputDto) {
  //   const group = this.em.create(UserGroup, {
  //     name: dto.name,
  //     permissions: dto.permissions,
  //   });

  //   const org = this.em.create(User, {
  //     type: 'organization',
  //     group: group,
  //     info: {
  //       name: dto.name,
  //       taxCode: dto.taxCode,
  //       phone: dto.phone,
  //       address: dto.address,
  //       website: dto.website,
  //     },
  //     password: undefined,
  //   });

  //   await this.em.flush();

  //   return UserMapper.toOrganizationResponse(org as UserOrganizationWithGroup);
  // }

  // @RequirePermission('organization:member:read')
  // @Get(':orgId/members')
  // async getOrgMembers(@Param('orgId') orgId: string){
    
  // }

  // @RequirePermission('organization:member:manage')
  // @Post(':orgId/members')
  // async createMember(@Param('orgId') orgId: string, @Body() dto: OrgMemberInputDto) {
  //   const org = await this.userRepo.findOrganizationById(orgId);
  //   User.ensureExists(org);

  //   const orgMember = this.em.create(User, {
  //     type: 'people',
  //     email: dto.email,
  //     group: org.group.getEntity(),
  //     password: dto.password,
  //     info: {
  //       name: dto.name,
  //       taxCode: dto.taxCode,
  //       phone: dto.phone,
  //       address: dto.address,
  //       website: dto.website,
  //     },
  //   });

  //   await this.em.flush();

  //   return UserMapper.toUserResponse(orgMember);
  // }
}
