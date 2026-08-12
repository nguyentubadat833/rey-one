import { EntityManager, EventArgs, EventSubscriber } from '@mikro-orm/core';
import { Domain } from '../entities/domain.entity';
import { Injectable } from '@nestjs/common';
import { DomainCache } from '@/utils/cache/domain-cache';

@Injectable()
export class DomainSubscriber implements EventSubscriber<Domain> {
  constructor(
    private readonly domainCache: DomainCache,
    private readonly em: EntityManager,
  ) {
    this.em.getEventManager().registerSubscriber(this);
  }

  async afterUpdate(args: EventArgs<Domain>) {
    const changeSet = args.changeSet;

    if (!changeSet) return;

    const oldStatus = changeSet.originalEntity?.active;
    const newStatus = args.entity.active;

    if (oldStatus !== newStatus) {
      await this.domainCache.domainStatus(args.entity.id.toString()).set(Boolean(newStatus));
    }
  }

  // async afterCreate(args: EventArgs<Product>) {
  //   await this.cacheManager.del('products:list');
  // }

  // async afterDelete(args: EventArgs<Product>) {
  //   await this.cacheManager.del('products:list');
  // }
}
