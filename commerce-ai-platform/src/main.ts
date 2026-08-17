import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ApiExceptionFilter } from './shared/api/api-exception.filter';
import { loadEnv } from './shared/config/env';

async function bootstrap(): Promise<void> {
  const env = loadEnv();
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors({ origin: env.corsOrigins });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new ApiExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Commerce AI Platform API')
    .setDescription('Semantic search, review intelligence, and analyst APIs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, config));

  await app.listen(env.port);
  console.log(`AI Platform listening on http://localhost:${env.port}`);
  console.log(`Swagger docs at http://localhost:${env.port}/api/docs`);
}

void bootstrap();
