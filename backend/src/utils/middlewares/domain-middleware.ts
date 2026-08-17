import { AppClsStore } from '@/utils/types/system';
import { DOMAIN_ID_HEADER } from '@/utils/types/utils';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class DomainMiddleware implements NestMiddleware {
  constructor(private readonly cls: ClsService<AppClsStore>) {}

  async use(req: FastifyRequest['raw'], res: FastifyReply['raw'], next: () => void) {
    const domainId = req.headers[DOMAIN_ID_HEADER] as string | undefined;
    // if (!domainId) throw DomainRequiredError()

    this.cls.set('domainId', domainId);
    next();
  }
}
