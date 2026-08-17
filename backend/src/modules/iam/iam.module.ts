import { authConfig } from '@/configs/auth.config';
import { User, UserInfo } from '@/persistence/entities/user.entity';
import { MikroORM, RequestContext } from '@mikro-orm/core';
import { Inject, MiddlewareConsumer, Module, NestModule, OnModuleInit } from '@nestjs/common';
import { ConfigModule, type ConfigType } from '@nestjs/config';
import { APP_GUARD, ModuleRef } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controllers/auth-controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AuthService } from './services/auth-service';
import { Domain } from '@/persistence/entities/domain.entity';
import { UserController } from './controllers/user-controller';
// import { UserSummary } from '@/persistence/entities/query-entities/user-query';
// import { DomainSummary } from '@/persistence/entities/query-entities/domain-query';
import { AuthGuard } from './guard/auth.guard';
import { AdminGuard } from './guard/admin.guard';
// import { PermissionGuard } from './guard/permission-guard';
import { DomainMiddleware } from '../../utils/middlewares/domain-middleware';
import { UserAuth } from '@/utils/types/system';
import { DomainService } from './services/domain-service';
import { DomainController } from './controllers/domain-controller';
import { UserService } from './services/user-service';
import { UserLoadedDomain } from '@/persistence/types/user-type';
@Module({
  imports: [
    MikroOrmModule.forFeature({
      // entities: [User, UserSummary, Domain, DomainSummary],
      entities: [User, Domain],
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
  providers: [
    // Đăng ký AuthGuard làm Global Guard
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    // {
    //   provide: SERVICE_TOKENS.DOAMIN_SERVICE,
    //   useExisting: DomainService,
    // },
    //
    AuthService,
    DomainService,
    UserService,
    //
    AdminGuard,
    // PermissionGuard,
    //
    // DomainCache,
    // DomainSubscriber,
  ],
  exports: [
    AdminGuard, 
    // PermissionGuard
  ],
  controllers: [AuthController, UserController, DomainController],
})
export class IAMModule implements OnModuleInit, NestModule {
  constructor(
    private readonly authService: AuthService,
    private readonly orm: MikroORM,
    private readonly moduleRef: ModuleRef,
    @Inject(authConfig.KEY) private readonly config: ConfigType<typeof authConfig>,
  ) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(DomainMiddleware).forRoutes(DomainController);
  }

  async onModuleInit() {
    await RequestContext.create(this.orm.em, async () => {
      const em = RequestContext.getEntityManager()!;

      const admin = {
        identity: this.config.userDefault.admin.identity,
        password: this.config.userDefault.admin.password,
      };

      const identity = AuthService.IdentityDetect(admin.identity);

      let user = await em.findOne(User, {
        ...identity,
      });

      if (!user) {
        user = em.create(User, {
          ...identity,
          password: admin.password,
          info: em.create(UserInfo, {
            name: 'Administrator',
          }),
        });

        await em.flush();
      }

      await em.populate(user, ['info', 'domain']);

      this.authService.adminUser = {
        id: user.id,
        scope: User.parseUserScope(user as UserLoadedDomain),
      } satisfies UserAuth;

      console.info('===== Admin user has been initialized =====');
    });
  }
}
