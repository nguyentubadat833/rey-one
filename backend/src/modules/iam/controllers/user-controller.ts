import { RequireAdmin, RequireAuth, RequirePermission } from '@/utils/decorators/auth.decorator';
import { PaginationQueryDto } from '@/utils/dtos/utils-dto';
import { ResponseMapper } from '@/utils/mappers/response-mapper';
import { EntityManager } from '@mikro-orm/core';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserDetailDto, UserSummariesDto, UserSummaryDto } from '../dtos/user-dto';
import { UserMapper } from '../mappers/user-mapper';
import { User } from '@/persistence/entities/user.entity';
import { UserNotFoundError } from '@/utils/errors/user.error';
import { type PaginatedResponse } from '@rey-one/shared';
@RequireAuth()
@ApiTags('IAM / Users')
@Controller('users')
export class UserController {
  constructor(private readonly em: EntityManager) {}

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
        role: {
          domain: null,
        },
      },
      {
        limit,
        offset: (page - 1) * limit,
        orderBy: [
          {
            createdAt: 'desc',
          },
        ],
        populate: ['info', 'role'],
      },
    );

    const users = data.map((item) => UserMapper.userToUserSummary(item));
    return ResponseMapper.toPaginatedResponse(users, total, page, limit);
  }

  @RequirePermission('user:read')
  @ApiOperation({ summary: 'Get user detail' })
  @ApiOkResponse({type: UserDetailDto})
  @Get(':id/detail')
  async getUserDetail(@Param('id') userId: string) {
    const user = await this.em.findOneOrFail(
      User,
      {
        id: userId,
      },
      {
        failHandler: UserNotFoundError,
        populate: ['role.domain.info', 'info'],
      },
    );

    return UserMapper.userToUserDetail(user)
  }

  // @RequireAdmin()
  // @ApiOperation({ summary: 'Create user' })
  // @Post()
  // async createUser(@Body() dto: CreateUserDto) {
  //   return this.userService.createUser(dto).then(UserMapper.toUserDetailView);
  // }

  // @RequireAdmin()
  // @ApiOperation({ summary: 'Update user' })
  // @Patch(':id')
  // async updateUser(@Param('id') userId: string, @Body() dto: CreateUserDto) {
  //   return this.userService.updateUser(userId, dto).then(UserMapper.toUserDetailView);
  // }
}
