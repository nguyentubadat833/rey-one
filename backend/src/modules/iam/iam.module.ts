import { authConfig } from "@/configs/auth.config";
import { User } from "@/persistence/entities/iam.user-entity";
import { UserGroup } from "@/persistence/entities/iam.user-group-entity";
import { MikroORM, RequestContext } from "@mikro-orm/core";
import { Inject, Module, OnModuleInit } from "@nestjs/common";
import { ConfigModule, type ConfigType } from "@nestjs/config";
import { ModuleRef } from "@nestjs/core";

@Module({
    imports: [
        ConfigModule.forFeature(authConfig),
    ],
    controllers: [],
    providers: []
})
export class IAMModule implements OnModuleInit {

    constructor(
        private readonly orm: MikroORM,
        private readonly moduleRef: ModuleRef,
        @Inject(authConfig.KEY) private readonly config: ConfigType<typeof authConfig>,
    ) { }

    async onModuleInit() {
        await RequestContext.create(this.orm.em, async () => {
            const em = RequestContext.getEntityManager()!

            const adminGroup = em.create(UserGroup, {
                name: this.config.admin.group
            })

            em.create(User, {
                type: 'people',
                group: adminGroup,
                email: this.config.admin.email,
                password: this.config.admin.password
            })

            await em.flush()
        })
    }
}