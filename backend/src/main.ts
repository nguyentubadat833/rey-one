import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import { cleanupOpenApiDoc } from 'nestjs-zod';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MikroORM } from '@mikro-orm/core';
import { join } from 'path';
// import { SocketIoAdapter } from './modules/platform/event/socket.adapter';
import fastifyCookie from '@fastify/cookie';
import fastifyView from '@fastify/view';
import handlebars from 'handlebars';
import { AppModules } from './app/app.modules';
import { ResponseConfig } from './utils/interceptors/response-config';
import { ZodValidationPipeConfig } from './utils/pipes/validate-configs';
import { AppCatchEverythingFilter } from './utils/errors/filters/catch-everything.filter';
import { DatabaseSeeder } from './app/app.seeder';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModules, new FastifyAdapter());
  const configService = app.get(ConfigService);
  const appPort = configService.get<number>('app.port') ?? 4000;
  const appEnv = configService.get<string>('app.env');
  const origins = configService.get<string[]>('app.origins');
  const autoUpdateDatabase = configService.get<boolean>('db.dbAutoUpdate');
  const cookieSecret = configService.get<string>('auth.cookieSecret');

  if (appEnv !== 'production' || autoUpdateDatabase) {
    const orm = app.get(MikroORM);

    await orm.em.getConnection().execute(`
    DROP SCHEMA public CASCADE;
    CREATE SCHEMA public;
    `);

    await orm.schema.refresh();

    // const diff = await orm.schema.getUpdateSchemaSQL();
    // if (diff.length) {
    //   console.log(diff);
    //   await orm.schema.update();
    // }

    // await orm.seeder.seed(DatabaseSeeder);
  }

  // app.useWebSocketAdapter(new SocketIoAdapter(app, configService));

  app.enableCors({
    origin: origins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Cookie
  await app.register(fastifyCookie, {
    secret: cookieSecret,
  });

  await app.register(fastifyView, {
    engine: { handlebars },
    root: join(process.cwd(), 'src', 'app', 'views'),
  });

  app.setGlobalPrefix('rmk-api');

  // Response
  app.useGlobalInterceptors(new ResponseConfig());

  // Validation
  app.useGlobalPipes(new ZodValidationPipeConfig());
  const httpAdapterHost = app.get(HttpAdapterHost);

  // Filter error
  app.useGlobalFilters(new AppCatchEverythingFilter(httpAdapterHost));

  // Swagger
  const config = new DocumentBuilder().setTitle('API').setVersion('1.0').addCookieAuth('reauth_token').addBearerAuth().addBasicAuth().build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, cleanupOpenApiDoc(document));

  await app.listen(appPort, '0.0.0.0');
  console.log(`App running at: ${await app.getUrl()}`);

  // Seeds
  // const roleSeed = app.get(UserSeedService);
  // await roleSeed.seed();
}

void bootstrap();
