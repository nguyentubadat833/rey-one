import { EntityDTO, Loaded } from "@mikro-orm/core";
import { Domain } from "../entities/domain.entity";

export type DomainObject = EntityDTO<Domain>
export type DomainLoadedInfo = Loaded<Domain, 'info'>
export type DomainLoadedOwner = Loaded<Domain, 'owner'>
export type DoaminLoadedInfoAndOwner = Loaded<Domain, 'info' | 'owner'>