import { UserSummary } from '@/persistence/entities/query-entities/user-query';
import { RequireAdmin, RequireAuth } from '@/utils/decorators/auth.decorator';
import { PaginationQueryDto } from '@/utils/dtos/utils-dto';
import { ResponseMapper } from '@/utils/mappers/response-mapper';
import { EntityManager } from '@mikro-orm/core';
import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserSummariesView, UserSummaryView } from '@rey-one/shared';

@RequireAuth()
@ApiTags('IAM / Users')
@Controller('users')
export class UserController {
  constructor(private readonly em: EntityManager) {}

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
}
