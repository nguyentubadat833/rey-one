import { EntityRepository, raw } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { Domain } from '../entities/iam-domain.entity';

@Injectable()
export class DomainRepository extends EntityRepository<Domain> {
    
  async save(domain: Domain) {
    this.em.persist(domain);
    await this.em.flush();
    return domain;
  }
}
