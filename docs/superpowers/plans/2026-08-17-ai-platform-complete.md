# AI Platform Complete Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a dedicated `commerce-ai-platform` NestJS service with real semantic product search, review intelligence APIs, and a guarded Text-to-SQL analyst skeleton, then connect the existing admin AI pages to real APIs.

**Architecture:** `commerce-ai-platform` is a separate NestJS service with global prefix `/api` and AI routes under `/api/ai/*`. It reads canonical marketplace data from PostgreSQL through a read-only-compatible query layer, writes AI artifacts only to the `ai` schema, and exposes typed DTO responses for `commerce-admin`.

**Tech Stack:** NestJS 11, TypeScript 5.7, TypeORM, PostgreSQL + pgvector, Jest, Swagger, React 19, Vite 6, Ant Design 5, TanStack Query, Axios.

## Global Constraints

- Run `codegraph sync` from the repository root before source analysis or edits.
- If touching `commerce-core-service-nestjs`, read `commerce-core-service-nestjs/AGENTS.md` and every file under `commerce-core-service-nestjs/docs/agent/` listed by that AGENTS file.
- Do not add AI business logic to `commerce-core-service-nestjs`.
- Do not add unprefixed Core business routes such as `/api/products`; Core routes remain `/api/cms/*` or future `/api/client/*`.
- `commerce-ai-platform` routes use global prefix `/api` and feature prefix `/ai`.
- Controllers return explicit DTOs or lean acknowledgement objects, never TypeORM entities.
- Use NestJS feature modules, constructor injection, and injection tokens for provider interfaces.
- Keep real credentials out of `.env.example`, docs, test fixtures, and committed config.
- Admin UI text remains Vietnamese.
- `commerce-admin` must call AI APIs through `aiApi`, not `coreApi`.
- Prefer deterministic local providers so tests and demos run without external AI keys.

---

## File Structure

Create and modify these files across the plan:

```txt
commerce-ai-platform/
  package.json
  package-lock.json
  nest-cli.json
  tsconfig.json
  tsconfig.build.json
  jest.config.ts
  .env.example
  Dockerfile
  README.md
  src/
    main.ts
    app.module.ts
    shared/
      config/env.ts
      database/database.module.ts
      api/api-error-code.ts
      api/api-error-response.dto.ts
      api/api-exception.filter.ts
      api/mutation-response.dto.ts
    modules/
      health/health.controller.ts
      health/health.module.ts
      providers/embedding-provider.interface.ts
      providers/chat-provider.interface.ts
      providers/local-embedding.provider.ts
      providers/openai-embedding.provider.ts
      providers/rule-based-chat.provider.ts
      providers/providers.module.ts
      core-data/core-data.types.ts
      core-data/core-data.service.ts
      core-data/core-data.module.ts
      vector-store/vector-store.types.ts
      vector-store/vector-store.service.ts
      vector-store/vector-store.module.ts
      indexing/indexing.dto.ts
      indexing/product-indexing.service.ts
      indexing/product-indexing.controller.ts
      indexing/indexing.module.ts
      semantic-search/semantic-search.dto.ts
      semantic-search/semantic-search.service.ts
      semantic-search/semantic-search.controller.ts
      semantic-search/semantic-search.module.ts
      review-intelligence/review-intelligence.dto.ts
      review-intelligence/review-intelligence.service.ts
      review-intelligence/review-intelligence.controller.ts
      review-intelligence/review-intelligence.module.ts
      sql-safety/sql-safety.types.ts
      sql-safety/sql-safety.service.ts
      sql-safety/sql-safety.module.ts
      analyst-chat/analyst-chat.dto.ts
      analyst-chat/analyst-chat.service.ts
      analyst-chat/analyst-chat.controller.ts
      analyst-chat/analyst-chat.module.ts
      ai-logs/ai-logs.types.ts
      ai-logs/ai-logs.service.ts
      ai-logs/ai-logs.controller.ts
      ai-logs/ai-logs.module.ts
```

```txt
commerce-admin/src/
  shared/api/http-client.ts
  modules/ai-search/ai-search.types.ts
  modules/ai-search/ai-search.api.ts
  modules/ai-search/AiSearchPage.tsx
  modules/review-intelligence/review-intelligence.types.ts
  modules/review-intelligence/review-intelligence.api.ts
  modules/review-intelligence/ReviewIntelligencePage.tsx
  modules/analyst-chat/analyst-chat.types.ts
  modules/analyst-chat/analyst-chat.api.ts
  modules/analyst-chat/AnalystChatPage.tsx
```

---

### Task 1: Scaffold AI NestJS Service Foundation

**Files:**
- Create: `commerce-ai-platform/package.json`
- Create: `commerce-ai-platform/nest-cli.json`
- Create: `commerce-ai-platform/tsconfig.json`
- Create: `commerce-ai-platform/tsconfig.build.json`
- Create: `commerce-ai-platform/jest.config.ts`
- Create: `commerce-ai-platform/.env.example`
- Create: `commerce-ai-platform/src/main.ts`
- Create: `commerce-ai-platform/src/app.module.ts`
- Create: `commerce-ai-platform/src/shared/config/env.ts`
- Create: `commerce-ai-platform/src/shared/api/api-error-code.ts`
- Create: `commerce-ai-platform/src/shared/api/api-error-response.dto.ts`
- Create: `commerce-ai-platform/src/shared/api/api-exception.filter.ts`
- Create: `commerce-ai-platform/src/shared/api/mutation-response.dto.ts`
- Create: `commerce-ai-platform/src/modules/health/health.controller.ts`
- Create: `commerce-ai-platform/src/modules/health/health.module.ts`
- Test: `commerce-ai-platform/src/modules/health/health.controller.spec.ts`

**Interfaces:**
- Produces: `loadEnv(): AiEnv`
- Produces: `HealthController.getHealth(): { status: 'ok'; service: 'commerce-ai-platform'; timestamp: string }`
- Produces: global prefix `/api`

- [ ] **Step 1: Create package and TypeScript config**

Use the same NestJS major versions as `commerce-core-service-nestjs`.

```json
{
  "name": "commerce-ai-platform",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "build": "nest build",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:prod": "node dist/main",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage"
  },
  "dependencies": {
    "@nestjs/common": "^11.0.1",
    "@nestjs/config": "^4.0.4",
    "@nestjs/core": "^11.0.1",
    "@nestjs/platform-express": "^11.0.1",
    "@nestjs/swagger": "^11.4.6",
    "@nestjs/typeorm": "^11.0.3",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.15.1",
    "pg": "^8.22.0",
    "reflect-metadata": "^0.2.2",
    "rxjs": "^7.8.1",
    "typeorm": "^1.1.0"
  },
  "devDependencies": {
    "@nestjs/cli": "^11.0.0",
    "@nestjs/schematics": "^11.0.0",
    "@nestjs/testing": "^11.0.1",
    "@types/jest": "^30.0.0",
    "@types/node": "^24.0.0",
    "jest": "^30.0.0",
    "source-map-support": "^0.5.21",
    "supertest": "^7.0.0",
    "ts-jest": "^29.2.5",
    "ts-loader": "^9.5.2",
    "ts-node": "^10.9.2",
    "tsconfig-paths": "^4.2.0",
    "typescript": "^5.7.3"
  }
}
```

- [ ] **Step 2: Create environment loader**

```ts
export interface AiEnv {
  port: number;
  nodeEnv: string;
  corsOrigins: string[];
  db: {
    host: string;
    port: number;
    user: string;
    password: string;
    name: string;
    synchronize: boolean;
  };
  ai: {
    embeddingProvider: 'local' | 'openai';
    embeddingModel: string;
    embeddingDimension: number;
    openAiApiKey?: string;
  };
}

export function loadEnv(): AiEnv {
  return {
    port: Number(process.env.PORT ?? 3001),
    nodeEnv: process.env.NODE_ENV ?? 'development',
    corsOrigins: (process.env.CORS_ORIGINS ?? 'http://localhost:5173')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
    db: {
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 5432),
      user: process.env.DB_USER ?? 'postgres',
      password: process.env.DB_PASSWORD ?? 'postgres',
      name: process.env.DB_NAME ?? 'commerce',
      synchronize: process.env.DB_SYNCHRONIZE !== 'false',
    },
    ai: {
      embeddingProvider:
        process.env.EMBEDDING_PROVIDER === 'openai' ? 'openai' : 'local',
      embeddingModel:
        process.env.EMBEDDING_MODEL ??
        (process.env.EMBEDDING_PROVIDER === 'openai'
          ? 'text-embedding-3-small'
          : 'local-hash-embedding-v1'),
      embeddingDimension: Number(process.env.EMBEDDING_DIMENSION ?? 64),
      openAiApiKey: process.env.OPENAI_API_KEY,
    },
  };
}
```

- [ ] **Step 3: Create main bootstrap**

```ts
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
}

void bootstrap();
```

- [ ] **Step 4: Create health test**

```ts
import { Test } from '@nestjs/testing';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  it('returns AI service health', () => {
    const controller = new HealthController();
    expect(controller.getHealth()).toMatchObject({
      status: 'ok',
      service: 'commerce-ai-platform',
    });
  });
});
```

- [ ] **Step 5: Run tests and build**

Run:

```bash
cd commerce-ai-platform
npm install
npm test -- health.controller.spec.ts
npm run build
```

Expected: health test passes and Nest build completes.

- [ ] **Step 6: Commit**

```bash
git add commerce-ai-platform
git commit -m "feat(ai): scaffold AI platform service"
```

---

### Task 2: Add Database Module And AI Schema Initialization

**Files:**
- Create: `commerce-ai-platform/src/shared/database/database.module.ts`
- Modify: `commerce-ai-platform/src/app.module.ts`
- Test: `commerce-ai-platform/src/shared/database/database.module.spec.ts`

**Interfaces:**
- Consumes: `loadEnv(): AiEnv`
- Produces: TypeORM `DataSource` configured for PostgreSQL
- Produces: `DatabaseModule`
- Produces: `createTypeOrmOptions(env: AiEnv): TypeOrmModuleOptions`

- [ ] **Step 1: Write database config test**

```ts
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
```

- [ ] **Step 2: Create database module**

```ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import type { AiEnv } from '../config/env';
import { loadEnv } from '../config/env';

export function createTypeOrmOptions(env: AiEnv): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    host: env.db.host,
    port: env.db.port,
    username: env.db.user,
    password: env.db.password,
    database: env.db.name,
    synchronize: false,
    autoLoadEntities: false,
  };
}

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => createTypeOrmOptions(loadEnv()),
    }),
  ],
})
export class DatabaseModule {}
```

- [ ] **Step 3: Register database module**

```ts
import { Module } from '@nestjs/common';
import { DatabaseModule } from './shared/database/database.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [DatabaseModule, HealthModule],
})
export class AppModule {}
```

- [ ] **Step 4: Run tests**

Run:

```bash
cd commerce-ai-platform
npm test -- database.module.spec.ts
```

Expected: config test passes without starting a live database connection.

- [ ] **Step 5: Commit**

```bash
git add commerce-ai-platform/src/shared/database commerce-ai-platform/src/app.module.ts
git commit -m "feat(ai): add database module"
```

---

### Task 3: Add Provider Abstractions And Deterministic Embeddings

**Files:**
- Create: `commerce-ai-platform/src/modules/providers/embedding-provider.interface.ts`
- Create: `commerce-ai-platform/src/modules/providers/chat-provider.interface.ts`
- Create: `commerce-ai-platform/src/modules/providers/local-embedding.provider.ts`
- Create: `commerce-ai-platform/src/modules/providers/openai-embedding.provider.ts`
- Create: `commerce-ai-platform/src/modules/providers/rule-based-chat.provider.ts`
- Create: `commerce-ai-platform/src/modules/providers/providers.module.ts`
- Modify: `commerce-ai-platform/src/app.module.ts`
- Test: `commerce-ai-platform/src/modules/providers/local-embedding.provider.spec.ts`

**Interfaces:**
- Produces: `EMBEDDING_PROVIDER` injection token
- Produces: `EmbeddingProvider.embed(input: EmbedInput): Promise<EmbedResult>`
- Produces: `CHAT_PROVIDER` injection token
- Produces: `ChatProvider.explainProductMatch(input: ProductMatchExplanationInput): Promise<string>`

- [ ] **Step 1: Write local embedding tests**

```ts
import { LocalEmbeddingProvider } from './local-embedding.provider';

describe('LocalEmbeddingProvider', () => {
  it('returns deterministic normalized vectors', async () => {
    const provider = new LocalEmbeddingProvider(8);
    const first = await provider.embed({ text: 'kem chống nắng da dầu' });
    const second = await provider.embed({ text: 'kem chống nắng da dầu' });

    expect(first.vector).toEqual(second.vector);
    expect(first.vector).toHaveLength(8);
    expect(first.model).toBe('local-hash-embedding-v1');
  });

  it('returns similar vectors for overlapping text', async () => {
    const provider = new LocalEmbeddingProvider(16);
    const a = await provider.embed({ text: 'giày chạy bộ nhẹ' });
    const b = await provider.embed({ text: 'giày thể thao chạy bộ' });

    const dot = a.vector.reduce((sum, value, index) => sum + value * b.vector[index], 0);
    expect(dot).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Define interfaces**

```ts
export const EMBEDDING_PROVIDER = Symbol('EMBEDDING_PROVIDER');

export interface EmbedInput {
  text: string;
}

export interface EmbedResult {
  vector: number[];
  model: string;
  dimension: number;
}

export interface EmbeddingProvider {
  embed(input: EmbedInput): Promise<EmbedResult>;
}
```

```ts
export const CHAT_PROVIDER = Symbol('CHAT_PROVIDER');

export interface ProductMatchExplanationInput {
  query: string;
  productTitle: string;
  matchedFields: string[];
  score: number;
}

export interface ReviewAnalysisInput {
  title?: string;
  content: string;
  rating: number;
}

export interface ChatProvider {
  explainProductMatch(input: ProductMatchExplanationInput): Promise<string>;
  analyzeReview(input: ReviewAnalysisInput): Promise<{
    sentiment: 'positive' | 'neutral' | 'negative';
    sentimentScore: number;
    topics: string[];
    complaints: string[];
    praises: string[];
  }>;
}
```

- [ ] **Step 3: Implement local embedding provider**

Use token hashing into a fixed-size vector, then L2 normalize.

```ts
import { EmbedInput, EmbedResult, EmbeddingProvider } from './embedding-provider.interface';

export class LocalEmbeddingProvider implements EmbeddingProvider {
  constructor(private readonly dimension = 64) {}

  async embed(input: EmbedInput): Promise<EmbedResult> {
    const vector = new Array<number>(this.dimension).fill(0);
    const tokens = this.tokenize(input.text);

    for (const token of tokens) {
      const hash = this.hash(token);
      vector[Math.abs(hash) % this.dimension] += hash >= 0 ? 1 : -1;
    }

    const magnitude = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0)) || 1;
    return {
      vector: vector.map((value) => Number((value / magnitude).toFixed(8))),
      model: 'local-hash-embedding-v1',
      dimension: this.dimension,
    };
  }

  private tokenize(text: string): string[] {
    return text
      .normalize('NFKD')
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      .split(/\s+/)
      .filter(Boolean);
  }

  private hash(value: string): number {
    let hash = 2166136261;
    for (const char of value) {
      hash ^= char.charCodeAt(0);
      hash = Math.imul(hash, 16777619);
    }
    return hash | 0;
  }
}
```

- [ ] **Step 4: Implement providers module**

Create `OpenAiEmbeddingProvider` with native `fetch` and request `dimensions: 64` so it matches the pgvector table dimension:

```ts
import { EmbedInput, EmbedResult, EmbeddingProvider } from './embedding-provider.interface';

export class OpenAiEmbeddingProvider implements EmbeddingProvider {
  constructor(
    private readonly apiKey: string,
    private readonly model: string,
    private readonly dimension = 64,
  ) {}

  async embed(input: EmbedInput): Promise<EmbedResult> {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        input: input.text,
        dimensions: this.dimension,
      }),
    });

    if (!response.ok) {
      throw new Error(`Embedding provider failed with status ${response.status}`);
    }

    const payload = (await response.json()) as { data: Array<{ embedding: number[] }> };
    return {
      vector: payload.data[0]?.embedding ?? [],
      model: this.model,
      dimension: this.dimension,
    };
  }
}
```

```ts
import { Module } from '@nestjs/common';
import { loadEnv } from '../../shared/config/env';
import { EMBEDDING_PROVIDER } from './embedding-provider.interface';
import { LocalEmbeddingProvider } from './local-embedding.provider';
import { OpenAiEmbeddingProvider } from './openai-embedding.provider';
import { CHAT_PROVIDER } from './chat-provider.interface';
import { RuleBasedChatProvider } from './rule-based-chat.provider';

@Module({
  providers: [
    {
      provide: EMBEDDING_PROVIDER,
      useFactory: () => {
        const env = loadEnv();
        if (env.ai.embeddingProvider === 'openai' && env.ai.openAiApiKey) {
          return new OpenAiEmbeddingProvider(
            env.ai.openAiApiKey,
            env.ai.embeddingModel,
            env.ai.embeddingDimension,
          );
        }
        return new LocalEmbeddingProvider(env.ai.embeddingDimension);
      },
    },
    { provide: CHAT_PROVIDER, useClass: RuleBasedChatProvider },
  ],
  exports: [EMBEDDING_PROVIDER, CHAT_PROVIDER],
})
export class ProvidersModule {}
```

- [ ] **Step 5: Run tests**

Run:

```bash
cd commerce-ai-platform
npm test -- local-embedding.provider.spec.ts
```

Expected: local embedding tests pass without network access.

- [ ] **Step 6: Commit**

```bash
git add commerce-ai-platform/src/modules/providers commerce-ai-platform/src/app.module.ts
git commit -m "feat(ai): add provider abstractions"
```

---

### Task 4: Add Core Data Reader

**Files:**
- Create: `commerce-ai-platform/src/modules/core-data/core-data.types.ts`
- Create: `commerce-ai-platform/src/modules/core-data/core-data.service.ts`
- Create: `commerce-ai-platform/src/modules/core-data/core-data.module.ts`
- Modify: `commerce-ai-platform/src/app.module.ts`
- Test: `commerce-ai-platform/src/modules/core-data/core-data.service.spec.ts`

**Interfaces:**
- Produces: `CoreProductRecord`
- Produces: `CoreReviewRecord`
- Produces: `CoreDataService.listActiveProducts(): Promise<CoreProductRecord[]>`
- Produces: `CoreDataService.getProductById(id: string): Promise<CoreProductRecord | null>`
- Produces: `CoreDataService.listApprovedReviews(productId?: string): Promise<CoreReviewRecord[]>`
- Produces: `buildProductSourceText(product: CoreProductRecord): string`

- [ ] **Step 1: Write source text test**

```ts
import { buildProductSourceText } from './core-data.service';
import type { CoreProductRecord } from './core-data.types';

describe('buildProductSourceText', () => {
  it('includes searchable product fields', () => {
    const product: CoreProductRecord = {
      id: 'p1',
      title: 'Kem chống nắng SPF50+',
      slug: 'kem-chong-nang',
      brand: 'Anessa',
      description: 'Phù hợp da dầu',
      status: 'ACTIVE',
      priceMin: 200000,
      priceMax: 300000,
      ratingAvg: 4.6,
      reviewCount: 12,
      categoryName: 'Beauty',
      categoryPath: 'beauty/skincare',
      sellerName: 'Shop A',
      specsJson: { skin_type: 'oily', spf: '50+' },
    };

    expect(buildProductSourceText(product)).toContain('Kem chống nắng SPF50+');
    expect(buildProductSourceText(product)).toContain('Beauty');
    expect(buildProductSourceText(product)).toContain('skin_type: oily');
  });
});
```

- [ ] **Step 2: Define types**

```ts
export interface CoreProductRecord {
  id: string;
  title: string;
  slug: string;
  brand?: string | null;
  description?: string | null;
  status: string;
  priceMin?: number | null;
  priceMax?: number | null;
  ratingAvg?: number | null;
  reviewCount?: number | null;
  categoryName?: string | null;
  categoryPath?: string | null;
  sellerName?: string | null;
  specsJson?: Record<string, unknown> | null;
}

export interface CoreReviewRecord {
  id: string;
  productId: string;
  rating: number;
  title?: string | null;
  content: string;
  status: string;
}
```

- [ ] **Step 3: Implement source text builder**

```ts
export function buildProductSourceText(product: CoreProductRecord): string {
  const specs = Object.entries(product.specsJson ?? {})
    .map(([key, value]) => `${key}: ${String(value)}`)
    .join('; ');

  return [
    `title: ${product.title}`,
    product.brand ? `brand: ${product.brand}` : '',
    product.categoryName ? `category: ${product.categoryName}` : '',
    product.categoryPath ? `category_path: ${product.categoryPath}` : '',
    product.sellerName ? `seller: ${product.sellerName}` : '',
    product.description ? `description: ${product.description}` : '',
    specs ? `specs: ${specs}` : '',
    `rating: ${product.ratingAvg ?? 0}`,
    `reviews: ${product.reviewCount ?? 0}`,
  ]
    .filter(Boolean)
    .join('\n');
}
```

- [ ] **Step 4: Implement read-only-compatible queries**

Use `DataSource.query` with explicit projections and no updates to marketplace tables.

```ts
const PRODUCT_QUERY = `
  SELECT
    p.id,
    p.title,
    p.slug,
    p.brand,
    p.description,
    p.status,
    p.price_min AS "priceMin",
    p.price_max AS "priceMax",
    p.rating_avg AS "ratingAvg",
    p.review_count AS "reviewCount",
    c.name AS "categoryName",
    c.path AS "categoryPath",
    s.name AS "sellerName",
    p.specs_json AS "specsJson"
  FROM marketplace.products p
  LEFT JOIN marketplace.categories c ON c.id = p.category_id
  LEFT JOIN marketplace.sellers s ON s.id = p.seller_id
  WHERE p.status = 'ACTIVE'
`;
```

- [ ] **Step 5: Run tests**

Run:

```bash
cd commerce-ai-platform
npm test -- core-data.service.spec.ts
```

Expected: source text test passes.

- [ ] **Step 6: Commit**

```bash
git add commerce-ai-platform/src/modules/core-data commerce-ai-platform/src/app.module.ts
git commit -m "feat(ai): add core data reader"
```

---

### Task 5: Add Vector Store And AI Tables

**Files:**
- Create: `commerce-ai-platform/src/modules/vector-store/vector-store.types.ts`
- Create: `commerce-ai-platform/src/modules/vector-store/vector-store.service.ts`
- Create: `commerce-ai-platform/src/modules/vector-store/vector-store.module.ts`
- Modify: `commerce-ai-platform/src/app.module.ts`
- Test: `commerce-ai-platform/src/modules/vector-store/vector-store.service.spec.ts`

**Interfaces:**
- Produces: `VectorStoreService.ensureSchema(): Promise<void>`
- Produces: `VectorStoreService.upsertProductEmbedding(input: UpsertProductEmbeddingInput): Promise<void>`
- Produces: `VectorStoreService.searchProducts(input: SearchProductEmbeddingsInput): Promise<ProductEmbeddingSearchResult[]>`
- Produces: `cosineSimilarity(a: number[], b: number[]): number`

- [ ] **Step 1: Write cosine similarity tests**

```ts
import { cosineSimilarity } from './vector-store.service';

describe('cosineSimilarity', () => {
  it('scores identical vectors as 1', () => {
    expect(cosineSimilarity([1, 0, 0], [1, 0, 0])).toBeCloseTo(1);
  });

  it('scores orthogonal vectors as 0', () => {
    expect(cosineSimilarity([1, 0, 0], [0, 1, 0])).toBeCloseTo(0);
  });
});
```

- [ ] **Step 2: Define vector store types**

```ts
export interface UpsertProductEmbeddingInput {
  productId: string;
  sourceText: string;
  sourceTextHash: string;
  embedding: number[];
  embeddingModel: string;
  embeddingVersion: string;
  metadata: Record<string, unknown>;
}

export interface SearchProductEmbeddingsInput {
  embedding: number[];
  limit: number;
  filters?: {
    category?: string;
    brand?: string;
    priceMin?: number;
    priceMax?: number;
    ratingMin?: number;
  };
}

export interface ProductEmbeddingSearchResult {
  productId: string;
  score: number;
  sourceText: string;
  metadata: Record<string, unknown>;
}
```

- [ ] **Step 3: Implement schema setup**

Use raw SQL because pgvector support is clearer through SQL than entity decorators.

```ts
await this.dataSource.query('CREATE EXTENSION IF NOT EXISTS vector');
await this.dataSource.query('CREATE EXTENSION IF NOT EXISTS pgcrypto');
await this.dataSource.query('CREATE SCHEMA IF NOT EXISTS ai');
await this.dataSource.query(`
  CREATE TABLE IF NOT EXISTS ai.product_embeddings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id uuid NOT NULL UNIQUE,
    source_text text NOT NULL,
    source_text_hash varchar(64) NOT NULL,
    embedding vector(64) NOT NULL,
    embedding_model varchar(120) NOT NULL,
    embedding_version varchar(80) NOT NULL,
    metadata_json jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
  )
`);
```

- [ ] **Step 4: Implement vector search SQL**

Use pgvector distance and convert to similarity score.

```ts
const vectorLiteral = `[${input.embedding.join(',')}]`;
const rows = await this.dataSource.query(
  `
    SELECT
      product_id AS "productId",
      source_text AS "sourceText",
      metadata_json AS metadata,
      1 - (embedding <=> $1::vector) AS score
    FROM ai.product_embeddings
    ORDER BY embedding <=> $1::vector
    LIMIT $2
  `,
  [vectorLiteral, input.limit],
);
```

- [ ] **Step 5: Run tests**

Run:

```bash
cd commerce-ai-platform
npm test -- vector-store.service.spec.ts
```

Expected: cosine similarity tests pass.

- [ ] **Step 6: Commit**

```bash
git add commerce-ai-platform/src/modules/vector-store commerce-ai-platform/src/app.module.ts
git commit -m "feat(ai): add vector store"
```

---

### Task 6: Add Product Indexing API

**Files:**
- Create: `commerce-ai-platform/src/modules/indexing/indexing.dto.ts`
- Create: `commerce-ai-platform/src/modules/indexing/product-indexing.service.ts`
- Create: `commerce-ai-platform/src/modules/indexing/product-indexing.controller.ts`
- Create: `commerce-ai-platform/src/modules/indexing/indexing.module.ts`
- Modify: `commerce-ai-platform/src/app.module.ts`
- Test: `commerce-ai-platform/src/modules/indexing/product-indexing.service.spec.ts`

**Interfaces:**
- Consumes: `CoreDataService`
- Consumes: `EmbeddingProvider`
- Consumes: `VectorStoreService`
- Produces: `ProductIndexingService.runAll(): Promise<ProductIndexingRunResponseDto>`
- Produces: `ProductIndexingService.runOne(productId: string): Promise<ProductIndexingRunResponseDto>`
- Produces routes:
  - `POST /api/ai/indexing/products/run`
  - `POST /api/ai/indexing/products/:productId/run`

- [ ] **Step 1: Write indexing service test**

```ts
describe('ProductIndexingService', () => {
  it('indexes active products idempotently by product id', async () => {
    const service = new ProductIndexingService(coreData, embeddingProvider, vectorStore);
    const result = await service.runAll();

    expect(result.totalProducts).toBe(1);
    expect(result.indexedCount).toBe(1);
    expect(vectorStore.upsertProductEmbedding).toHaveBeenCalledWith(
      expect.objectContaining({ productId: 'product-1' }),
    );
  });
});
```

- [ ] **Step 2: Define DTOs**

```ts
export class ProductIndexingRunResponseDto {
  success: boolean;
  runId: string;
  status: 'COMPLETED' | 'FAILED';
  totalProducts: number;
  indexedCount: number;
  skippedCount: number;
  failedCount: number;
  message: string;
}
```

- [ ] **Step 3: Implement source hash**

```ts
import { createHash, randomUUID } from 'crypto';

function hashSourceText(sourceText: string): string {
  return createHash('sha256').update(sourceText).digest('hex');
}
```

- [ ] **Step 4: Implement indexing flow**

For each product:

```ts
const sourceText = buildProductSourceText(product);
const embedding = await this.embeddingProvider.embed({ text: sourceText });
await this.vectorStore.upsertProductEmbedding({
  productId: product.id,
  sourceText,
  sourceTextHash: hashSourceText(sourceText),
  embedding: embedding.vector,
  embeddingModel: embedding.model,
  embeddingVersion: 'v1',
  metadata: {
    title: product.title,
    slug: product.slug,
    brand: product.brand,
    category: product.categoryName,
    categoryPath: product.categoryPath,
    seller: product.sellerName,
    priceMin: product.priceMin,
    priceMax: product.priceMax,
    ratingAvg: product.ratingAvg,
    reviewCount: product.reviewCount,
  },
});
```

- [ ] **Step 5: Run tests and build**

Run:

```bash
cd commerce-ai-platform
npm test -- product-indexing.service.spec.ts
npm run build
```

Expected: indexing test and build pass.

- [ ] **Step 6: Commit**

```bash
git add commerce-ai-platform/src/modules/indexing commerce-ai-platform/src/app.module.ts
git commit -m "feat(ai): add product indexing"
```

---

### Task 7: Add Semantic Product Search API

**Files:**
- Create: `commerce-ai-platform/src/modules/semantic-search/semantic-search.dto.ts`
- Create: `commerce-ai-platform/src/modules/semantic-search/semantic-search.service.ts`
- Create: `commerce-ai-platform/src/modules/semantic-search/semantic-search.controller.ts`
- Create: `commerce-ai-platform/src/modules/semantic-search/semantic-search.module.ts`
- Modify: `commerce-ai-platform/src/app.module.ts`
- Test: `commerce-ai-platform/src/modules/semantic-search/semantic-search.service.spec.ts`

**Interfaces:**
- Consumes: `EmbeddingProvider`
- Consumes: `VectorStoreService`
- Consumes: `ChatProvider`
- Produces: `SemanticSearchService.searchProducts(request: SemanticProductSearchRequestDto): Promise<SemanticProductSearchResponseDto>`
- Produces route: `POST /api/ai/search/products`

- [ ] **Step 1: Write search ranking test**

```ts
describe('SemanticSearchService', () => {
  it('returns ranked semantic product results with explanations', async () => {
    const service = new SemanticSearchService(embeddingProvider, vectorStore, chatProvider);
    const result = await service.searchProducts({
      query: 'kem chống nắng cho da dầu',
      limit: 5,
    });

    expect(result.items).toHaveLength(1);
    expect(result.items[0]).toMatchObject({
      productId: 'product-1',
      title: 'Kem chống nắng SPF50+',
    });
    expect(result.items[0].score).toBeGreaterThan(0);
    expect(result.items[0].explanation).toContain('phù hợp');
  });
});
```

- [ ] **Step 2: Define DTOs**

```ts
export class SemanticProductSearchFiltersDto {
  category?: string;
  brand?: string;
  priceMin?: number;
  priceMax?: number;
  ratingMin?: number;
}

export class SemanticProductSearchRequestDto {
  query: string;
  filters?: SemanticProductSearchFiltersDto;
  limit?: number;
}

export class SemanticProductSearchItemDto {
  productId: string;
  title: string;
  slug?: string;
  brand?: string | null;
  category?: string | null;
  seller?: string | null;
  priceMin?: number | null;
  priceMax?: number | null;
  ratingAvg?: number | null;
  reviewCount?: number | null;
  score: number;
  matchedFields: string[];
  explanation: string;
}

export class SemanticProductSearchResponseDto {
  query: string;
  provider: string;
  items: SemanticProductSearchItemDto[];
}
```

- [ ] **Step 3: Implement matched fields**

```ts
function detectMatchedFields(query: string, metadata: Record<string, unknown>): string[] {
  const queryLower = query.toLowerCase();
  return ['title', 'brand', 'category', 'seller']
  .filter((field) =>
    String(metadata[field] ?? '')
      .toLowerCase()
      .split(/\s+/)
      .some((token) => token.length > 1 && queryLower.includes(token)),
  );
}
```

- [ ] **Step 4: Implement service**

```ts
const limit = Math.min(Math.max(request.limit ?? 10, 1), 50);
const embedding = await this.embeddingProvider.embed({ text: request.query });
const results = await this.vectorStore.searchProducts({
  embedding: embedding.vector,
  limit,
  filters: request.filters,
});

const items = await Promise.all(
  results.map(async (result) => {
    const metadata = result.metadata;
    const matchedFields = detectMatchedFields(request.query, metadata);
    return {
      productId: result.productId,
      title: String(metadata.title ?? ''),
      slug: String(metadata.slug ?? ''),
      brand: metadata.brand ? String(metadata.brand) : null,
      category: metadata.category ? String(metadata.category) : null,
      seller: metadata.seller ? String(metadata.seller) : null,
      priceMin: Number(metadata.priceMin ?? 0),
      priceMax: Number(metadata.priceMax ?? 0),
      ratingAvg: Number(metadata.ratingAvg ?? 0),
      reviewCount: Number(metadata.reviewCount ?? 0),
      score: Number(result.score.toFixed(4)),
      matchedFields,
      explanation: await this.chatProvider.explainProductMatch({
        query: request.query,
        productTitle: String(metadata.title ?? ''),
        matchedFields,
        score: result.score,
      }),
    };
  }),
);
```

- [ ] **Step 5: Run tests and build**

Run:

```bash
cd commerce-ai-platform
npm test -- semantic-search.service.spec.ts
npm run build
```

Expected: search test and build pass.

- [ ] **Step 6: Commit**

```bash
git add commerce-ai-platform/src/modules/semantic-search commerce-ai-platform/src/app.module.ts
git commit -m "feat(ai): add semantic product search"
```

---

### Task 8: Add Review Intelligence APIs

**Files:**
- Create: `commerce-ai-platform/src/modules/review-intelligence/review-intelligence.dto.ts`
- Create: `commerce-ai-platform/src/modules/review-intelligence/review-intelligence.service.ts`
- Create: `commerce-ai-platform/src/modules/review-intelligence/review-intelligence.controller.ts`
- Create: `commerce-ai-platform/src/modules/review-intelligence/review-intelligence.module.ts`
- Modify: `commerce-ai-platform/src/app.module.ts`
- Test: `commerce-ai-platform/src/modules/review-intelligence/review-intelligence.service.spec.ts`

**Interfaces:**
- Consumes: `CoreDataService`
- Consumes: `ChatProvider`
- Produces: `ReviewIntelligenceService.analyzeReview(reviewId: string): Promise<ReviewAnalysisResponseDto>`
- Produces: `ReviewIntelligenceService.analyzeAll(): Promise<ReviewAnalysisRunResponseDto>`
- Produces: `ReviewIntelligenceService.getProductSummary(productId: string): Promise<ProductReviewSummaryResponseDto>`
- Produces routes:
  - `POST /api/ai/reviews/analyze/run`
  - `POST /api/ai/reviews/:reviewId/analyze`
  - `GET /api/ai/products/:productId/review-summary`
  - `GET /api/ai/reviews/analysis`

- [ ] **Step 1: Write review analysis test**

```ts
describe('ReviewIntelligenceService', () => {
  it('classifies negative reviews with complaints', async () => {
    const result = await service.analyzeReviewText({
      rating: 2,
      title: 'Giao hàng chậm',
      content: 'Sản phẩm tốt nhưng giao hàng quá chậm và đóng gói kém',
    });

    expect(result.sentiment).toBe('negative');
    expect(result.complaints).toContain('delivery');
  });
});
```

- [ ] **Step 2: Define DTOs**

```ts
export class ReviewAnalysisResponseDto {
  reviewId: string;
  productId: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  sentimentScore: number;
  topics: string[];
  complaints: string[];
  praises: string[];
  model: string;
}

export class ProductReviewSummaryResponseDto {
  productId: string;
  sentimentBreakdown: { positive: number; neutral: number; negative: number };
  topTopics: string[];
  commonComplaints: string[];
  commonPraises: string[];
  sourceReviewCount: number;
  confidence: number;
}
```

- [ ] **Step 3: Implement rule-based analysis**

Use deterministic keyword groups:

```ts
const complaintKeywords = {
  delivery: ['giao hàng chậm', 'chậm', 'trễ'],
  packaging: ['đóng gói kém', 'móp', 'vỡ'],
  quality: ['hỏng', 'lỗi', 'kém', 'không tốt'],
};

const praiseKeywords = {
  quality: ['tốt', 'bền', 'xịn', 'chất lượng'],
  price: ['giá tốt', 'rẻ', 'đáng tiền'],
  delivery: ['giao nhanh', 'nhanh'],
};
```

- [ ] **Step 4: Implement persistence**

Create `ai.review_ai_analysis` in `VectorStoreService.ensureSchema()` or a dedicated method and upsert by `review_id`.

```sql
CREATE TABLE IF NOT EXISTS ai.review_ai_analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id uuid NOT NULL UNIQUE,
  product_id uuid NOT NULL,
  sentiment varchar(20) NOT NULL,
  sentiment_score numeric(5,4) NOT NULL,
  topics_json jsonb NOT NULL DEFAULT '[]'::jsonb,
  complaints_json jsonb NOT NULL DEFAULT '[]'::jsonb,
  praises_json jsonb NOT NULL DEFAULT '[]'::jsonb,
  model varchar(120) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
)
```

- [ ] **Step 5: Run tests and build**

Run:

```bash
cd commerce-ai-platform
npm test -- review-intelligence.service.spec.ts
npm run build
```

Expected: review intelligence tests and build pass.

- [ ] **Step 6: Commit**

```bash
git add commerce-ai-platform/src/modules/review-intelligence commerce-ai-platform/src/modules/vector-store commerce-ai-platform/src/app.module.ts
git commit -m "feat(ai): add review intelligence"
```

---

### Task 9: Add SQL Safety And Analyst Chat Skeleton

**Files:**
- Create: `commerce-ai-platform/src/modules/sql-safety/sql-safety.types.ts`
- Create: `commerce-ai-platform/src/modules/sql-safety/sql-safety.service.ts`
- Create: `commerce-ai-platform/src/modules/sql-safety/sql-safety.module.ts`
- Create: `commerce-ai-platform/src/modules/ai-logs/ai-logs.types.ts`
- Create: `commerce-ai-platform/src/modules/ai-logs/ai-logs.service.ts`
- Create: `commerce-ai-platform/src/modules/ai-logs/ai-logs.controller.ts`
- Create: `commerce-ai-platform/src/modules/ai-logs/ai-logs.module.ts`
- Create: `commerce-ai-platform/src/modules/analyst-chat/analyst-chat.dto.ts`
- Create: `commerce-ai-platform/src/modules/analyst-chat/analyst-chat.service.ts`
- Create: `commerce-ai-platform/src/modules/analyst-chat/analyst-chat.controller.ts`
- Create: `commerce-ai-platform/src/modules/analyst-chat/analyst-chat.module.ts`
- Modify: `commerce-ai-platform/src/app.module.ts`
- Test: `commerce-ai-platform/src/modules/sql-safety/sql-safety.service.spec.ts`
- Test: `commerce-ai-platform/src/modules/analyst-chat/analyst-chat.service.spec.ts`

**Interfaces:**
- Produces: `SqlSafetyService.validate(sql: string): SqlSafetyResult`
- Produces: `AnalystChatService.ask(input: AnalystChatRequestDto): Promise<AnalystChatResponseDto>`
- Produces routes:
  - `POST /api/ai/analyst/chat`
  - `GET /api/ai/query-logs`

- [ ] **Step 1: Write SQL safety tests**

```ts
describe('SqlSafetyService', () => {
  it('blocks mutation SQL', () => {
    const result = service.validate('DELETE FROM marketplace.products');
    expect(result.allowed).toBe(false);
    expect(result.status).toBe('BLOCKED_MUTATION');
  });

  it('allows whitelisted SELECT with LIMIT', () => {
    const result = service.validate(
      'SELECT product_id, total_revenue FROM analytics.product_performance LIMIT 10',
    );
    expect(result.allowed).toBe(true);
    expect(result.status).toBe('ALLOWED');
  });

  it('requires LIMIT', () => {
    const result = service.validate('SELECT * FROM analytics.product_performance');
    expect(result.allowed).toBe(false);
    expect(result.status).toBe('MISSING_LIMIT');
  });
});
```

- [ ] **Step 2: Define safety types**

```ts
export type SqlSafetyStatus =
  | 'ALLOWED'
  | 'EMPTY_SQL'
  | 'NOT_SELECT'
  | 'BLOCKED_MUTATION'
  | 'UNSAFE_TABLE'
  | 'MISSING_LIMIT';

export interface SqlSafetyResult {
  allowed: boolean;
  status: SqlSafetyStatus;
  reasons: string[];
  normalizedSql?: string;
}
```

- [ ] **Step 3: Implement validator**

Use lowercased SQL checks and whitelist table patterns:

```ts
const blockedKeywords = ['insert', 'update', 'delete', 'drop', 'alter', 'truncate', 'create', 'grant', 'revoke'];
const allowedTables = [
  'analytics.product_performance',
  'analytics.review_sentiment',
  'analytics.seller_performance',
  'analytics.category_summary',
];
```

Validation rules:

```txt
1. Empty SQL returns EMPTY_SQL.
2. SQL must start with SELECT.
3. SQL must not include blocked keywords as whole words.
4. SQL must reference at least one allowed table.
5. SQL must include LIMIT.
```

- [ ] **Step 4: Define analyst DTOs**

```ts
export class AnalystChatRequestDto {
  question: string;
}

export class AnalystChatResponseDto {
  answer: string;
  generatedSql?: string;
  safetyStatus: string;
  executionStatus: 'NOT_EXECUTED' | 'SUCCESS' | 'FAILED';
  columns: string[];
  rows: Record<string, unknown>[];
  queryLogId?: string;
}
```

- [ ] **Step 5: Implement rule-based analyst skeleton**

Map a small set of Vietnamese/English question patterns to safe SQL:

```ts
function generateSql(question: string): string | null {
  const text = question.toLowerCase();
  if (text.includes('top') && text.includes('sản phẩm')) {
    return 'SELECT product_id, title, total_revenue FROM analytics.product_performance LIMIT 10';
  }
  if (text.includes('sentiment') || text.includes('review')) {
    return 'SELECT product_id, positive_count, neutral_count, negative_count FROM analytics.review_sentiment LIMIT 10';
  }
  return null;
}
```

If `generateSql()` returns `null`, return:

```ts
{
  answer: 'AI Analyst chưa có rule phù hợp cho câu hỏi này.',
  safetyStatus: 'NOT_GENERATED',
  executionStatus: 'NOT_EXECUTED',
  columns: [],
  rows: [],
}
```

- [ ] **Step 6: Add query logs table**

```sql
CREATE TABLE IF NOT EXISTS ai.ai_query_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NULL,
  question text NOT NULL,
  generated_sql text NULL,
  safety_status varchar(80) NOT NULL,
  execution_status varchar(80) NOT NULL,
  row_count int NOT NULL DEFAULT 0,
  duration_ms int NOT NULL DEFAULT 0,
  error_message text NULL,
  created_at timestamptz NOT NULL DEFAULT now()
)
```

- [ ] **Step 7: Run tests and build**

Run:

```bash
cd commerce-ai-platform
npm test -- sql-safety.service.spec.ts analyst-chat.service.spec.ts
npm run build
```

Expected: SQL safety, analyst skeleton tests, and build pass.

- [ ] **Step 8: Commit**

```bash
git add commerce-ai-platform/src/modules/sql-safety commerce-ai-platform/src/modules/analyst-chat commerce-ai-platform/src/modules/ai-logs commerce-ai-platform/src/app.module.ts
git commit -m "feat(ai): add analyst safety skeleton"
```

---

### Task 10: Connect Admin AI Pages To Real AI APIs

**Files:**
- Modify: `commerce-admin/src/shared/api/http-client.ts`
- Create: `commerce-admin/src/modules/ai-search/ai-search.types.ts`
- Create: `commerce-admin/src/modules/ai-search/ai-search.api.ts`
- Modify: `commerce-admin/src/modules/ai-search/AiSearchPage.tsx`
- Create: `commerce-admin/src/modules/review-intelligence/review-intelligence.types.ts`
- Create: `commerce-admin/src/modules/review-intelligence/review-intelligence.api.ts`
- Modify: `commerce-admin/src/modules/review-intelligence/ReviewIntelligencePage.tsx`
- Create: `commerce-admin/src/modules/analyst-chat/analyst-chat.types.ts`
- Create: `commerce-admin/src/modules/analyst-chat/analyst-chat.api.ts`
- Modify: `commerce-admin/src/modules/analyst-chat/AnalystChatPage.tsx`

**Interfaces:**
- Consumes: AI Platform routes under `/api/ai/*`
- Produces: `aiPath(path: string): string`
- Produces: `searchProducts(payload): Promise<SemanticProductSearchResponse>`
- Produces: `runReviewAnalysis(): Promise<ReviewAnalysisRunResponse>`
- Produces: `askAnalyst(payload): Promise<AnalystChatResponse>`

- [ ] **Step 1: Add AI path helper**

In `http-client.ts` add:

```ts
export const aiPath = (path: string) =>
  path.startsWith('/') ? `/ai${path}` : `/ai/${path}`;
```

- [ ] **Step 2: Create AI Search API wrapper**

```ts
import { aiApi, aiPath } from '@/shared/api/http-client';
import type { SemanticProductSearchRequest, SemanticProductSearchResponse } from './ai-search.types';

export async function searchAiProducts(
  payload: SemanticProductSearchRequest,
): Promise<SemanticProductSearchResponse> {
  const response = await aiApi.post<SemanticProductSearchResponse>(aiPath('/search/products'), payload);
  return response.data;
}
```

- [ ] **Step 3: Update AI Search page**

Use `useMutation` from TanStack Query. Enable the primary button when `queryText.trim().length > 0`. Render result cards with title, score, category, brand, price range, and explanation. Keep an unavailable `Alert` only when the API request fails.

- [ ] **Step 4: Create Review Intelligence wrappers**

```ts
export async function runReviewAnalysis(): Promise<ReviewAnalysisRunResponse> {
  const response = await aiApi.post<ReviewAnalysisRunResponse>(aiPath('/reviews/analyze/run'));
  return response.data;
}

export async function fetchProductReviewSummary(productId: string): Promise<ProductReviewSummaryResponse> {
  const response = await aiApi.get<ProductReviewSummaryResponse>(aiPath(`/products/${productId}/review-summary`));
  return response.data;
}
```

- [ ] **Step 5: Create Analyst Chat wrapper**

```ts
export async function askAnalyst(question: string): Promise<AnalystChatResponse> {
  const response = await aiApi.post<AnalystChatResponse>(aiPath('/analyst/chat'), { question });
  return response.data;
}
```

- [ ] **Step 6: Run admin tests and build**

Run:

```bash
cd commerce-admin
npm test
npm run build
```

Expected: tests and build pass.

- [ ] **Step 7: Commit**

```bash
git add commerce-admin/src/shared/api/http-client.ts commerce-admin/src/modules/ai-search commerce-admin/src/modules/review-intelligence commerce-admin/src/modules/analyst-chat
git commit -m "feat(admin): connect AI pages to AI platform"
```

---

### Task 11: Add Infra, Docs, And Demo Runbook

**Files:**
- Create: `commerce-ai-platform/Dockerfile`
- Modify: `commerce-ai-platform/.env.example`
- Modify: `commerce-ai-platform/README.md`
- Modify: `commerce-platform-infra/docker-compose.yml`
- Modify: `commerce-admin/.env.example`
- Modify: `README.md`

**Interfaces:**
- Produces: documented local AI service on `http://localhost:3001`
- Produces: documented Swagger URL `http://localhost:3001/api/docs`
- Produces: documented demo flow

- [ ] **Step 1: Sanitize env examples**

Use placeholders only:

```env
PORT=3001
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=commerce
DB_SYNCHRONIZE=true
CORS_ORIGINS=http://localhost:5173
EMBEDDING_PROVIDER=local
EMBEDDING_MODEL=local-hash-embedding-v1
EMBEDDING_DIMENSION=64
OPENAI_API_KEY=
```

- [ ] **Step 2: Add Dockerfile**

```dockerfile
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package*.json ./
CMD ["node", "dist/main"]
```

- [ ] **Step 3: Add README demo flow**

Document:

```txt
1. Start PostgreSQL/pgvector.
2. Start Core service and seed data.
3. Start AI Platform.
4. POST /api/ai/indexing/products/run.
5. POST /api/ai/search/products with query "kem chống nắng cho da dầu".
6. Open admin AI Search page and run the same query.
7. Run review analysis.
8. Ask Analyst Chat "top sản phẩm".
```

- [ ] **Step 4: Run full verification**

Run:

```bash
cd commerce-ai-platform
npm test
npm run build

cd ../commerce-admin
npm test
npm run build

cd ../commerce-core-service-nestjs
npm test -- --runInBand
npm run build

cd ..
git diff --check
```

Expected: all tests and builds pass, or the final handoff states the exact command and failure text.

- [ ] **Step 5: Commit**

```bash
git add commerce-ai-platform commerce-platform-infra/docker-compose.yml commerce-admin/.env.example README.md
git commit -m "docs(ai): add AI platform runbook"
```

---

## Final Acceptance Checklist

- [ ] `commerce-ai-platform` exists as a real NestJS service.
- [ ] `GET /api/health` returns `commerce-ai-platform`.
- [ ] `POST /api/ai/indexing/products/run` indexes Core products.
- [ ] `POST /api/ai/search/products` returns ranked products with scores and explanations.
- [ ] `POST /api/ai/reviews/analyze/run` creates review intelligence.
- [ ] `GET /api/ai/products/:productId/review-summary` returns aggregated review summary.
- [ ] `POST /api/ai/analyst/chat` returns a safety-aware analyst response.
- [ ] `GET /api/ai/query-logs` returns audit logs.
- [ ] Admin AI Search, Review Intelligence, and Analyst Chat pages call real AI API wrappers.
- [ ] No committed file contains real DB passwords, JWT secrets, or API keys.
- [ ] `npm test` and `npm run build` pass in `commerce-ai-platform`.
- [ ] `npm test` and `npm run build` pass in `commerce-admin`.
- [ ] Core tests/build are run if Core files change.

## Self-Review Notes

- The plan keeps AI logic outside Core and preserves `/api/cms/*` Core boundaries.
- Semantic search is the only module required to run fully end-to-end in the first AI slice.
- Review intelligence is deterministic and testable without an external provider.
- Text-to-SQL focuses on safety and auditability before broad SQL generation.
- Admin integration is limited to existing AI pages and does not add buyer or seller portal scope.
