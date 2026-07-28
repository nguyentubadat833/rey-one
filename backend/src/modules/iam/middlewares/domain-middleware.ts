import { CLS_KEYS } from "@/utils/types/tokens";
import { DOMAIN_ID_HEADER } from "@/utils/types/utils";
import { Injectable, NestMiddleware } from "@nestjs/common";
import { FastifyReply, FastifyRequest } from "fastify";
import { ClsService } from "nestjs-cls";

@Injectable()
export class DomainMiddleware implements NestMiddleware {
  constructor(private readonly cls: ClsService) {}

  use(req: FastifyRequest['raw'], res: FastifyReply['raw'], next: () => void) {
    const domainId = req.headers[DOMAIN_ID_HEADER] as string;

    if (domainId) {
      this.cls.set(CLS_KEYS.DOMAIN_ID, domainId);
    }

    next();
  }
}