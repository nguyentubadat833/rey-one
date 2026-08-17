import { Domain } from "@/persistence/entities/domain.entity";
import { UserAuth } from "@/utils/types/system";

export interface AuthUtils{
    get adminUser(): UserAuth
    getActor(): UserAuth
    isActorAdmin(): boolean
}

export interface DomainUtils{
    getDomainIdFromContext(): string
    getDomainFromContext(): Promise<Domain>
    getDomainById(id: string): Promise<Domain>
}