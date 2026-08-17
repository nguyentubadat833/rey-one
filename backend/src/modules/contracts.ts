import { Domain } from "@/persistence/entities/domain.entity";
import { UserAuth } from "@/utils/types/system";

export interface AuthUtils {
    isActorAdmin(): boolean
    getAdminUser(): UserAuth
    getActor(): UserAuth
}

export interface DomainUtils {
    // getDomainFromContext(): Promise<Domain>
    getDomainIdFromContext(): string
    getDomainById(id: string, requireActive: boolean): Promise<Domain>
}