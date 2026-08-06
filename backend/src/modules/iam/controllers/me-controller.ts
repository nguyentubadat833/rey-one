import { UserRepository } from "@/persistence/repositories/user-repository";
import { RequireAuth } from "@/utils/decorators/auth.decorator";
import { EntityManager } from "@mikro-orm/core";
import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthService } from "../services/auth-service";
import { CurrentUser } from "@/utils/decorators/utils.decorator";
import { User } from "@/persistence/entities/iam-user.entity";
import { UserMapper } from "../mappers/user-mapper";
import { DomainMemberService } from "../services/domain/member-service";
import { DomainMapper } from "../mappers/domain-mapper";
import { UserDomainAccess } from "@rey-one/shared";
import { DomainService } from "../services/domain/domain-service";

@RequireAuth()
@ApiTags('Me')
@Controller('me')
export class MeController {
    constructor(
        private readonly em: EntityManager,
        private readonly userRepo: UserRepository,
        private readonly domainService: DomainService,
        private readonly domainMemberService: DomainMemberService
    ) { }

    @ApiOperation({ summary: 'Get me' })
    @Get()
    async getMe(@CurrentUser('id') userId: string) {
        const user = await this.userRepo.findByIdentity({ id: userId });
        User.ensureExists(user);

        const loadedUser = await this.em.populate(user, ['party']);
        return UserMapper.toUserView(loadedUser);
    }

    @ApiOperation({ summary: "Get domains" })
    @Get('/domains')
    async getDomains(): Promise<UserDomainAccess[]> {
        return await this.domainService.getUserAccessDomains()
    }
}