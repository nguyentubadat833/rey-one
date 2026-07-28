import { Domain } from '@/persistence/entities/iam-domain.entity';
import { CLS_KEYS } from '@/utils/types/tokens';
import { EventSubscriber, EventArgs, EntityMetadata } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';

// Interface đánh dấu các entity thuộc về Domain
export interface IDomainOwnedEntity {
  domain?: unknown;
}

@Injectable()
export class DomainRelationSubscriber implements EventSubscriber<IDomainOwnedEntity> {
  constructor(private readonly cls: ClsService) {}

  async beforeCreate(args: EventArgs<IDomainOwnedEntity>): Promise<void> {
    const domainId = this.cls.get<string>(CLS_KEYS.DOMAIN_ID);
    if (!domainId) {
      return;
    }

    const meta: EntityMetadata<IDomainOwnedEntity> = args.meta;

    // Kiểm tra xem entity này có relation 'domain' hay không
    if (meta.properties.domain && !args.entity.domain) {
      // getReference tạo ra Proxy Reference đến IAMDomain bằng ID
      args.entity.domain = args.em.getReference(Domain, domainId);
    }
  }
}