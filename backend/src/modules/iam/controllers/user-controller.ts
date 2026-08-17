import { RequireAdmin, RequireAuth, RequireDomainPermission, RequireSystemPermission } from '@/utils/decorators/auth.decorator';
import { PaginationQueryDto } from '@/utils/dtos/utils-dto';
import { ResponseMapper } from '@/utils/mappers/response-mapper';
import { EntityManager } from '@mikro-orm/core';
import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto, SystemUserDto, UserSummariesDto, UserSummaryDto } from '../dtos/user-dto';
import { UserMapper } from '../mappers/user-mapper';
import { User } from '@/persistence/entities/user.entity';
import { UserService } from '../services/user-service';
import { type PaginatedResponse } from '@rey-one/shared';
import { UserNotFoundError } from '@/utils/errors/user.error';

@RequireAuth()
@ApiTags('IAM / Users')
@Controller('users')
export class UserController {
  constructor(
    private readonly em: EntityManager,
    private readonly userService: UserService
  ) { }

  @RequireAdmin()
  @ApiOperation({ summary: 'System-level user summaries' })
  @ApiOkResponse({
    type: UserSummariesDto,
  })
  @Get()
  async summaries(@Query() { limit, page }: PaginationQueryDto): Promise<PaginatedResponse<UserSummaryDto>> {
    const [data, total] = await this.em.findAndCount(
      User,
      {
        domain: null,
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

  @RequireSystemPermission('user@read')
  @ApiOperation({ summary: 'Get system-level user' })
  @ApiOkResponse({ type: SystemUserDto })
  @Get(':id')
  async getUserDetail(@Param('id') userId: string) {
    const user = await this.em.findOneOrFail(
      User,
      {
        id: userId,
      },
      {
        failHandler: UserNotFoundError,
        populate: ['info'],
      },
    );

    return UserMapper.toSystemUser(user)
  }

  @RequireSystemPermission('user@create')
  @ApiOperation({ summary: 'Create system-level user' })
  @ApiOkResponse({ type: SystemUserDto })
  @Post()
  async createUser(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto).then(UserMapper.toSystemUser);
  }

  @RequireSystemPermission('user@update')
  @ApiOperation({ summary: 'Update sytem-level user' })
  @ApiOkResponse({ type: SystemUserDto })
  @Patch(':id')
  async updateUser(@Param('id') userId: string, @Body() dto: CreateUserDto) {
    return this.userService.updateUser(userId, dto).then(UserMapper.toSystemUser);
  }
}
