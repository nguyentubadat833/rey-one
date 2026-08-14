import { AppClsStore } from '@/utils/types/system';
import { DOMAIN_ID_HEADER } from '@/utils/types/utils';
import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ClsService } from 'nestjs-cls';
import { AppError } from '../errors/app.error';

@Injectable()
export class DomainMiddleware implements NestMiddleware {
  constructor(
    private readonly cls: ClsService<AppClsStore>,
  ) {}

  async use(req: FastifyRequest['raw'], res: FastifyReply['raw'], next: () => void) {
    const domainId = req.headers[DOMAIN_ID_HEADER] as string;

    if (!domainId) {
      throw new BadRequestException(new AppError('INVALID_REQUEST_CONTEXT', 'Domain is required in the request context'));
    }

    this.cls.set('domainId', domainId);
    next();
  }
}
