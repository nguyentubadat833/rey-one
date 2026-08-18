import { Domain } from "@/persistence/entities/domain.entity";
import { User } from "@/persistence/entities/user.entity";
import { UserAuth } from "@/utils/types/system";
import { Opt } from "@mikro-orm/core";
import { CreateDomainMemberDto } from "./iam/dtos/domain-dto";

export interface AuthUtils {
    isActorAdmin(): boolean
    getAdminUser(): UserAuth
    getActor(): UserAuth
}

export interface DomainUtils {
    // getDomainFromContext(): Promise<Domain>
    getDomainIdFromContext(): string
    getDomainById(id: string, requireActive?: boolean): Promise<Domain>
    getDomainUserById(id: string): Promise<User>
    createCustomer(input: CreateDomainMemberDto): Promise<User>
}