import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Client } from 'pg';
import { AppModule } from './app.module';
import { loadEnv } from './shared/config/env';
import { ApiExceptionFilter } from './shared/api/api-exception.filter';
import { createVietnameseValidationException } from './shared/api/validation-error.util';

async function ensureSchemas(env: ReturnType<typeof loadEnv>): Promise<void> {
  if (!env.db.synchronize) {
    return;
  }
  const client = new Client({
    host: env.db.host,
    port: env.db.port,
    user: env.db.user,
    password: env.db.password,
    database: env.db.name,
  });
  try {
    await client.connect();
    await client.query('CREATE EXTENSION IF NOT EXISTS vector');
    await client.query(
      `CREATE SCHEMA IF NOT EXISTS identity;
       CREATE SCHEMA IF NOT EXISTS marketplace;
       CREATE SCHEMA IF NOT EXISTS ingestion;
       CREATE SCHEMA IF NOT EXISTS analytics;
       CREATE SCHEMA IF NOT EXISTS ai;`,
    );

    console.log(
      'Schemas ready: identity, marketplace, ingestion, analytics, ai',
    );
  } finally {
    await client.end();
  }
}

async function bootstrap(): Promise<void> {
  const env = loadEnv();
  await ensureSchemas(env);
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors({ origin: env.corsOrigins });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: createVietnameseValidationException,
    }),
  );

  app.useGlobalFilters(new ApiExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Commerce Core CMS API')
    .setDescription('AI Commerce Marketplace Core CMS API (admin/internal routes under /api/cms)')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(env.port);

  console.log(`Core service listening on http://localhost:${env.port}`);
  console.log(`Swagger docs at http://localhost:${env.port}/api/docs`);
}
void bootstrap();
