import { UserSummary } from '@/persistence/entities/query-entities/user-query';
import { RequireAdmin, RequireAuth } from '@/utils/decorators/auth.decorator';
import { PaginationQueryDto } from '@/utils/dtos/utils-dto';
import { ResponseMapper } from '@/utils/mappers/response-mapper';
import { EntityManager } from '@mikro-orm/core';
import { Body, Controller, Get, NotFoundException, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserSummariesView, UserSummaryView } from '@rey-one/shared';
import { CreateUserDto } from '../dtos/user-dto';
import { UserService } from '../services/user-service';
import { UserMapper } from '../mappers/user-mapper';

@RequireAuth()
@ApiTags('IAM / Users')
@Controller('users')
export class UserController {
  constructor(
    private readonly em: EntityManager,
    private readonly userService: UserService,
  ) { }

  @RequireAdmin()
  @ApiOperation({ summary: 'User summaries' })
  @Get()
  async summaries(@Query() { limit, page }: PaginationQueryDto): Promise<UserSummariesView> {
    const [data, total] = await this.em.findAndCount(
      UserSummary,
      {},
      {
        limit,
        offset: (page - 1) * limit,
      },
    );

    return ResponseMapper.toPaginatedResponse(data, total, page, limit);
  }

  @RequireAdmin()
  @ApiOperation({ summary: 'User summary' })
  @Get(':id')
  async summary(@Param('id') userId: string): Promise<UserSummaryView> {
    return this.em.findOneOrFail(
      UserSummary,
      {
        id: userId,
      },
      { failHandler: () => new NotFoundException() },
    );
  }

  @RequireAdmin()
  @ApiOperation({ summary: 'Create user' })
  @Post()
  async createUser(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto).then(UserMapper.toUserDetailView);
  }

  @RequireAdmin()
  @ApiOperation({ summary: 'Update user' })
  @Patch(':id')
  async updateUser(@Param('id') userId: string, @Body() dto: CreateUserDto) {
    return this.userService.updateUser(userId, dto).then(UserMapper.toUserDetailView);
  }
}
