import { UserSummary } from '@/persistence/queries/user-query';
import { RequireAdmin, RequireAuth } from '@/utils/decorators/auth.decorator';
import { EntityManager } from '@mikro-orm/core';
import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@RequireAuth()
@ApiTags('IAM / Users')
@Controller('users')
export class UserController {
  constructor(private readonly em: EntityManager) {}

  @RequireAdmin()
  @ApiOperation({ summary: 'User summaries' })
  @Get('summaries')
  async summaries() {
    return this.em.findAll(UserSummary);
  }

  @RequireAdmin()
  @ApiOperation({ summary: 'User summary' })
  @Get(':id')
  async summary(@Param('id') userId: string) {
    return this.em.findOneOrFail(
      UserSummary,
      {
        id: userId,
      },
      { failHandler: () => new NotFoundException() },
    );
  }
}
