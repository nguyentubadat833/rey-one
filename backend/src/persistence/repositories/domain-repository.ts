import { EntityRepository, raw } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { Domain } from '../entities/iam-domain.entity';
import { DomainSummaryView } from '@rey-one/shared';
import { AppError } from '@/utils/errors/app.error';

@Injectable()
export class DomainRepository extends EntityRepository<Domain> {
  private getBuilder() {
    return this.em.createQueryBuilder(Domain, 'd');
  }

  async getSummaries(): Promise<DomainSummaryView[]> {
    const result = await this.getBuilder()
      .select(['d.*', raw('count(distinct r.id) as role_count'), raw('count(distinct m.id) as member_count'), raw('count(distinct p.id) as product_count')])
      .leftJoin('d.roles', 'r')
      .leftJoin('d.members', 'm')
      .leftJoin('d.products', 'p')
      .groupBy('d.id')
      .execute();

    return result.map((row) => ({
      id: row.id,
      name: row.name,
      active: row.active,
      permissions: row.permissions,
      roleCount: Number(row.role_count),
      memberCount: Number(row.member_count),
      productCount: Number(row.product_count),
    }));
  }

  async getSummaryById(id: string): Promise<DomainSummaryView> {
    const result = await this.getBuilder()
      .select(['d.*', raw('count(distinct r.id) as role_count'), raw('count(distinct m.id) as member_count'), raw('count(distinct p.id) as product_count')])
      .where({ id })
      .leftJoin('d.roles', 'r')
      .leftJoin('d.members', 'm')
      .leftJoin('d.products', 'p')
      .groupBy('d.id')
      .execute();


    if (!result.length) {
      throw new AppError('OBJECT_NOT_FOUND', 'Domain not found');
    }

    const domain = result[0]

    return {
      id: domain['id'],
      name: domain['name'],
      active: domain['active'],
      permissions: domain['permissions'],
      roleCount: Number(domain['role_count']),
      memberCount: Number(domain['member_count']),
      productCount: Number(domain['product_count']),
    } satisfies DomainSummaryView;
  }
}
