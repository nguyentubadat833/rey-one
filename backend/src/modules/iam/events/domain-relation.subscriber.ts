// import { Domain } from '@/persistence/entities/iam-domain.entity';
// import { EventSubscriber, EventArgs, EntityMetadata, helper } from '@mikro-orm/core';
// import { Injectable } from '@nestjs/common';
// import { ClsService } from 'nestjs-cls';

// export interface IDomainOwnedEntity {
//   domain?: unknown;
// }

// @Injectable()
// export class DomainRelationSubscriber implements EventSubscriber<IDomainOwnedEntity> {
//   constructor(private readonly cls: ClsService) {}

//   onInit(args: EventArgs<IDomainOwnedEntity>): void {
//     this.assignDomainIfMissing(args);
//   }

//   beforeCreate(args: EventArgs<IDomainOwnedEntity>): void {
//     this.assignDomainIfMissing(args);
//   }

//   private assignDomainIfMissing(args: EventArgs<IDomainOwnedEntity>): void {
//     const domainId = this.cls.get<string>('domainId');
//     if (!domainId || !args.em) {
//       return;
//     }

//     const meta: EntityMetadata = helper(args.entity).__meta;

//     if (meta?.properties?.domain && !args.entity.domain) {
//       args.entity.domain = args.em.getReference(Domain, domainId);
//     }
//   }
// }