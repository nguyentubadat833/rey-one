import { EntityDTO, Loaded } from "@mikro-orm/core";
import { Domain } from "../entities/domain.entity";

export type DomainObject = EntityDTO<Domain>
export type DomainLoadedInfo = Loaded<Domain, 'info'>