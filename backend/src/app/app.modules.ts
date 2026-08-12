import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { appConfig } from '../configs/app.config';
import { databaseConfig } from '@/configs/database.config';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { IAMModule } from '@/modules/iam/iam.module';
import { CatalogModule } from '@/modules/catalog/catalog.module';
import { ClsModule } from 'nestjs-cls';
import { CacheModule } from '@nestjs/cache-manager';
import { CommerceModule } from '@/modules/commerce/commerce.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      cache: true,
      load: [appConfig, databaseConfig],
      isGlobal: true,
    }),
    MikroOrmModule.forRootAsync({
      driver: PostgreSqlDriver,
      inject: [databaseConfig.KEY],
      useFactory: (config: ConfigType<typeof databaseConfig>) => ({
        host: config.dbHost,
        port: config.dbPort,
        user: config.dbUser,
        password: config.dbPassword,
        dbName: config.dbName,
        debug: true,
        // entities: [User, UserSummary],
        autoLoadEntities: true,
        // entities: ['./dist/**/*.entity.js'],
        // entitiesTs: ['./src/**/*.entity.ts'],
        // subscribers: [new DomainRelationSubscriber(cls)]
      }),
    }),
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
      },
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    IAMModule,
    CatalogModule,
    // CommerceModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModules {}
