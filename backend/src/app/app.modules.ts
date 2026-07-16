import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { appConfig } from '../configs/app.config';
import { databaseConfig } from '@/configs/database.config';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { OAuthCredential } from '@/entities/iam.oauth-credential-entity';
import { Organization } from '@/entities/iam.organization-entity';
import { OrganizationMembership } from '@/entities/iam.organization-membership-entity';
import { OrganizationRole } from '@/entities/iam.organization-role-entity';
import { Party } from '@/entities/iam.party-entity';
import { User } from '@/entities/iam.user-entity';

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
        entities: [Party, User, OAuthCredential, Organization, OrganizationMembership, OrganizationRole],
        // autoLoadEntities: true,
        // entities: ['./dist/**/*.entity.js'],
        // entitiesTs: ['./src/**/*.entity.ts'],
      }),
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModules {}
