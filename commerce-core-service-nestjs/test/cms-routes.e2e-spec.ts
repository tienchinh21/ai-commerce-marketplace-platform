import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('CMS route namespace', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('keeps health outside the CMS namespace', async () => {
    await request(app.getHttpServer()).get('/api/health').expect(200);
  });

  it('mounts CMS auth under /api/cms/auth', async () => {
    await request(app.getHttpServer())
      .post('/api/cms/auth/login')
      .send({ email: 'not-an-email', password: '' })
      .expect(400);
  });

  it('does not mount old auth route', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'not-an-email', password: '' })
      .expect(404);
  });

  it('mounts protected CMS products under /api/cms/products', async () => {
    await request(app.getHttpServer()).get('/api/cms/products').expect(401);
  });

  it('does not mount old products route', async () => {
    await request(app.getHttpServer()).get('/api/products').expect(404);
  });

  it('mounts CMS categories under /api/cms/categories', async () => {
    await request(app.getHttpServer()).get('/api/cms/categories').expect(401);
  });

  it('does not mount old categories route', async () => {
    await request(app.getHttpServer()).get('/api/categories').expect(404);
  });

  it('mounts CMS analytics under /api/cms/analytics', async () => {
    await request(app.getHttpServer())
      .get('/api/cms/analytics/product-performance')
      .expect(401);
  });

  it('does not mount old analytics route', async () => {
    await request(app.getHttpServer())
      .get('/api/analytics/product-performance')
      .expect(404);
  });

  it('does not expose client namespace products', async () => {
    await request(app.getHttpServer()).get('/api/client/products').expect(404);
  });
});
