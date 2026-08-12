import { Party } from '@/persistence/entities/iam-party.entity';
import { RequireAuth, RequireTenant } from '@/utils/decorators/auth.decorator';
import { ApiDomainHeader } from '@/utils/decorators/utils.decorator';
import { PaginationQueryDto } from '@/utils/dtos/utils-dto';
import { AppClsStore } from '@/utils/types/system';
import { EntityManager } from '@mikro-orm/core';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ClsService } from 'nestjs-cls';

@RequireAuth()
@RequireTenant()
@ApiDomainHeader()
@ApiTags('CRM / Customers')
@Controller('customers')
export class CustomerController {
    constructor(
        private readonly clsStore: ClsService<AppClsStore>,
        private readonly em: EntityManager
    ){}

    @Get()
    async summaries(@Query() { limit, page }: PaginationQueryDto) {
        // const [data, total] = await this.em.findAndCount(
        //   Party,
        //   {
        //     customerDomain: this.clsStore.get('domainId')
        //   },
        //   {
        //     limit,
        //     offset: (page - 1) * limit,
        //     orderBy: [
        //       {
        //         createdAt: 'DESC',
        //       },
        //     ],
        //   },
        // );
    
        return
        // const customer = data.map((item) => OrderMapper.toOrderSummaryView(item));
        // return ResponseMapper.toPaginatedResponse(orders, total, page, limit);
      }
}
