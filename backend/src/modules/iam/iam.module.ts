import { authConfig } from '@/configs/auth.config';
import { User } from '@/persistence/entities/iam-user.entity';
import { MikroORM, RequestContext } from '@mikro-orm/core';
import { Inject, MiddlewareConsumer, Module, NestModule, OnModuleInit } from '@nestjs/common';
import { ConfigModule, type ConfigType } from '@nestjs/config';
import { APP_GUARD, ModuleRef } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controllers/auth-controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { DomainController } from './controllers/domain/domain-controller';
import { AuthService } from './services/auth-service';
import { Domain } from '@/persistence/entities/iam-domain.entity';
import { UserController } from './controllers/user-controller';
import { DomainRoleController } from './controllers/domain/role-controller';
import { UserSummary } from '@/persistence/entities/query-entities/user-query';
import { DomainMember } from '@/persistence/entities/iam-domain.member.entity';
import { DomainSummary } from '@/persistence/entities/query-entities/domain-query';
import { DomainService } from './services/domain-service';
import { DomainMemberController } from './controllers/domain/member-controller';
import { AuthGuard } from './guard/auth-guard';
import { RequireAdminGuard } from './guard/admin-guard';
import { RequirePermissionGuard } from './guard/permission-guard';
import { DomainRelationSubscriber } from './events/domain-relation.subscriber';
import { DomainMiddleware } from './middlewares/domain-middleware';

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [User, UserSummary, Domain, DomainMember, DomainSummary],
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
  controllers: [AuthController, DomainController, DomainRoleController, DomainMemberController, UserController],
  providers: [
    // Đăng ký AuthGuard làm Global Guard
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AuthService,
    DomainService,
    RequireAdminGuard,
    RequirePermissionGuard,
    //
    DomainRelationSubscriber
  ],
  exports: [RequireAdminGuard, RequirePermissionGuard],
})
export class IAMModule implements OnModuleInit, NestModule {
  constructor(
    private readonly orm: MikroORM,
    private readonly moduleRef: ModuleRef,
    @Inject(authConfig.KEY) private readonly config: ConfigType<typeof authConfig>,
  ) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(DomainMiddleware)
    .forRoutes(DomainMemberController, DomainRoleController)
  }

  async onModuleInit() {
    await RequestContext.create(this.orm.em, async () => {
      const em = RequestContext.getEntityManager()!;

      const users = [this.config.user.admin, this.config.user.support];

      for (const item of users) {
        const identity = AuthService.IdentityDetect(item.identity);
        const user = await em.findOne(User, identity);

        if (!user) {
          em.create(User, {
            ...identity,
            type: item.type,
            password: item.password,
            party: {
              name: item.identity,
            },
          });
        }
      }

      await em.flush();
    });
  }
}
