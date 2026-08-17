import { createTypeOrmOptions } from './database.module';
import type { AiEnv } from '../config/env';

describe('DatabaseModule', () => {
  it('creates TypeORM options from env without opening a DB connection', () => {
    const env: AiEnv = {
      port: 3001,
      nodeEnv: 'test',
      corsOrigins: ['http://localhost:5173'],
      db: {
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        password: 'postgres',
        name: 'commerce',
        synchronize: false,
      },
      ai: {
        embeddingProvider: 'local',
        embeddingModel: 'local-hash-embedding-v1',
        embeddingDimension: 64,
      },
    };

    expect(createTypeOrmOptions(env)).toMatchObject({
      type: 'postgres',
      host: 'localhost',
      database: 'commerce',
      synchronize: false,
    });
  });
});
