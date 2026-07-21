import { authConfig } from '@/configs/auth.config';
import { User, UserInfo } from '@/persistence/entities/iam.user-entity';
import { UserGroup } from '@/persistence/entities/iam.user-group-entity';
import { UserRepository } from '@/persistence/repositories/user-repository';
import { MikroORM, RequestContext } from '@mikro-orm/core';
import { Global, Inject, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, type ConfigType } from '@nestjs/config';
import { ModuleRef } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controllers/auth-controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Global()
@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [User, UserGroup],
    }),
    ConfigModule.forFeature(authConfig),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule.forFeature(authConfig)],
      inject: [authConfig.KEY],
      useFactory: (config: ConfigType<typeof authConfig>) => ({
        secret: config.jwtSecret,
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [],
})
export class IAMModule implements OnModuleInit {
  constructor(
    private readonly orm: MikroORM,
    private readonly moduleRef: ModuleRef,
    @Inject(authConfig.KEY) private readonly config: ConfigType<typeof authConfig>,
  ) {}

  async onModuleInit() {
    await RequestContext.create(this.orm.em, async () => {
      const em = RequestContext.getEntityManager()!;

      const users = [this.config.userDefault.admin, this.config.userDefault.support];

      for (const item of users) {
        const user = await em.findOne(User, {
          email: item.email,
        });

        if (!user) {
          let userGroup = await em.findOne(UserGroup, {
            name: item.group,
          });

          userGroup ??= em.create(UserGroup, {
            name: item.group,
          });

          em.create(User, {
            type: 'people',
            group: userGroup,
            email: item.email,
            password: item.password,
            info: {
              name: item.email,
            },
          });
        }
      }

      await em.flush();
    });
  }
}
