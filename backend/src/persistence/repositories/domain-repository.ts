import { EntityRepository } from "@mikro-orm/core";
import { Injectable } from "@nestjs/common";
import { Domain } from "../entities/iam.domain-entity";

@Injectable()
export class DomainRepository extends EntityRepository<Domain> {

}