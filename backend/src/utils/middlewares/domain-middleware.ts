import { DomainRepository } from '@/persistence/repositories/domain-repository';
import { AppClsStore } from '@/utils/types/system';
import { DOMAIN_ID_HEADER } from '@/utils/types/utils';
import { EntityManager } from '@mikro-orm/core';
import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ClsService } from 'nestjs-cls';
import { DomainNotFound } from '../errors/domain.error';
import { Domain } from '@/persistence/entities/iam-domain.entity';
import { DomainCache } from '@/utils/cache/domain-cache';

@Injectable()
export class DomainMiddleware implements NestMiddleware {
  constructor(
    private readonly cls: ClsService<AppClsStore>,
    // private readonly domainRepo: DomainRepository,
    // private readonly domainCache: DomainCache,
  ) {}

  async use(req: FastifyRequest['raw'], res: FastifyReply['raw'], next: () => void) {
    const domainId = req.headers[DOMAIN_ID_HEADER] as string;

    if (!domainId) {
      throw new BadRequestException('Domain is required');
    }

    // let active = await this.domainCache.status(domainId).get();

    // if (typeof active !== 'boolean') {
    //   console.log('find')
    //   const domain = await this.domainRepo.findOneOrFail(
    //     {
    //       id: domainId,
    //     },
    //     {
    //       fields: ['active'],
    //       failHandler: DomainNotFound,
    //     },
    //   );

    //   active = domain.active;
    //   await this.domainCache.status(domainId).set(active);
    // }

    // Domain.ensureStatusValue(active);

    this.cls.set('domainId', domainId);
    next();
  }
}
