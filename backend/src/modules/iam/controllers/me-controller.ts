import { UserRepository } from '@/persistence/repositories/user-repository';
import { RequireAuth } from '@/utils/decorators/auth.decorator';
import { EntityManager } from '@mikro-orm/core';
import { Controller, Delete, ForbiddenException, Get, HttpCode, HttpStatus, Param, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services/auth-service';
import { CurrentUser } from '@/utils/decorators/utils.decorator';
import { User } from '@/persistence/entities/user.entity';
import { UserMapper } from '../mappers/user-mapper';
import { DomainMapper } from '../mappers/domain-mapper';
import { DOMAIN_ID_HEADER, DOMAIN_ID_PARAMETER } from '@/utils/types/utils';
import type { FastifyReply } from 'fastify';
import { DomainService } from '../services/domain-service';

@RequireAuth()
@ApiTags('Me')
@Controller('me')
export class MeController {
  constructor(
    private readonly em: EntityManager,
    private readonly userRepo: UserRepository,
    private readonly domainService: DomainService
  ) {}

  // @ApiOperation({ summary: 'Get me' })
  // @Get()
  // async getMe(@CurrentUser('id') userId: string) {
  //   const user = await this.userRepo.findByIdentity({ id: userId });
  //   User.ensureExists(user);

  //   const loadedUser = await this.em.populate(user, ['party']);
  //   return UserMapper.toUserView(loadedUser);
  // }

  // @ApiOperation({ summary: 'Get domains' })
  // @Get('/domains')
  // async getDomains(): Promise<UserDomainAccess[]> {
  //   return await this.domainService.getUserAccessDomains();
  // }

  // @HttpCode(HttpStatus.NO_CONTENT)
  // @ApiOperation({ summary: 'User working domain' })
  // @Get(`/domains/:${DOMAIN_ID_PARAMETER}/working`)
  // async userWorkingDomain(@Param(DOMAIN_ID_PARAMETER) domainId: string, @Res({ passthrough: true }) res: FastifyReply) {
  //   const accessDomains = await this.domainService.getUserAccessDomains();
  //   if (!accessDomains.some((domain) => domain.domainId === domainId)) throw new ForbiddenException();

  //   res.header(DOMAIN_ID_HEADER, domainId);
  // }

  // @HttpCode(HttpStatus.NO_CONTENT)
  // @ApiOperation({ summary: 'User leave domain' })
  // @Delete(`/domains`)
  // async userLeaveDomain(@Res({ passthrough: true }) res: FastifyReply) {

  //   res.removeHeader(DOMAIN_ID_HEADER)
  // }
}
