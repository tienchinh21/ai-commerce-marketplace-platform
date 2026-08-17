# AI Platform Complete Design

## Purpose

Build `commerce-ai-platform` as a dedicated NestJS service that makes AI the main differentiator of the project while keeping the existing e-commerce scope focused on Core CMS data. The service must provide enough real AI-platform behavior for interview and CV use: semantic product search that runs end-to-end, review intelligence APIs, and a guarded Text-to-SQL analyst skeleton.

## Current Context

- `commerce-ai-platform/` currently contains only `README.md`.
- `commerce-core-service-nestjs/` already owns canonical marketplace data under `identity`, `marketplace`, `ingestion`, and `analytics`.
- The Core service creates the `ai` schema when `DB_SYNCHRONIZE=true`, but Core must not own AI logic.
- `commerce-admin` already has AI placeholder pages and an `aiApi` Axios client using `VITE_AI_API_BASE_URL`.
- Existing docs define `commerce-ai-platform` as a separate NestJS service that reads Core data through Core API or read-only PostgreSQL and writes only to the `ai` schema.

## Architecture Decision

Use a separate `commerce-ai-platform` NestJS service. Do not add AI business logic to `commerce-core-service-nestjs`.

The AI service will read canonical product and review data from PostgreSQL using a read-only-compatible query layer, write AI artifacts to the `ai` schema, and expose `/api/ai/*` APIs for the admin UI.

```txt
commerce-admin
  | calls VITE_AI_API_BASE_URL
  v
commerce-ai-platform
  | reads marketplace/analytics data
  | writes ai schema
  v
PostgreSQL + pgvector

commerce-core-service-nestjs
  | owns canonical CMS APIs and marketplace data
  v
PostgreSQL core schemas
```

## Non-Negotiable Rules

- Use CodeGraph before analyzing or editing source.
- Keep AI routes under `/api/ai/*`.
- Keep Core business routes under `/api/cms/*` or `/api/client/*`; do not add unprefixed routes.
- Do not place AI logic inside `commerce-core-service-nestjs`.
- If Core must be touched, follow `commerce-core-service-nestjs/AGENTS.md` and `commerce-core-service-nestjs/docs/agent/rules.md`.
- Do not return TypeORM entities directly from controllers.
- Use explicit DTOs for request and response contracts.
- Use provider interfaces and injection tokens for AI providers.
- Keep real secrets out of `.env.example`, docs, and committed config.
- Admin UI text remains Vietnamese.

## Scope

### Included

- NestJS scaffold for `commerce-ai-platform`.
- Health endpoint.
- Environment config and Swagger.
- Provider abstraction for embeddings and chat/analysis.
- Deterministic local embedding provider so the demo works without an API key.
- Optional OpenAI embedding provider through native `fetch` when `OPENAI_API_KEY` is configured.
- PostgreSQL vector store using `ai.product_embeddings`.
- Product indexing APIs.
- Semantic product search API with vector ranking, structured filters, score, matched fields, and explanation.
- Review intelligence APIs with rule-based sentiment/topic/complaint/praise extraction.
- Text-to-SQL safety validator and analyst chat skeleton with audit logs.
- Admin UI integration for AI Search, Review Intelligence, and Analyst Chat pages.
- Focused Jest tests and build verification.

### Excluded

- Buyer storefront.
- Seller portal.
- Full LLM agent workflow.
- LangChain or LangGraph dependency.
- Fine-tuning.
- Real crawler adapters.
- Payment, shipping, cart, and checkout.

## API Contract

Global prefix: `/api`.

```txt
GET  /api/health

POST /api/ai/indexing/products/run
POST /api/ai/indexing/products/:productId/run
GET  /api/ai/indexing/products/jobs/:jobId

POST /api/ai/search/products

POST /api/ai/reviews/analyze/run
POST /api/ai/reviews/:reviewId/analyze
GET  /api/ai/products/:productId/review-summary
GET  /api/ai/reviews/analysis

POST /api/ai/analyst/chat
GET  /api/ai/query-logs
```

## Data Model

The AI service writes only to the `ai` schema.

```txt
ai.product_embeddings
  id
  product_id
  source_text
  source_text_hash
  embedding vector(64)
  embedding_model
  embedding_version
  metadata_json
  created_at
  updated_at

ai.review_ai_analysis
  id
  review_id
  product_id
  sentiment
  sentiment_score
  topics_json
  complaints_json
  praises_json
  model
  created_at
  updated_at

ai.ai_query_logs
  id
  user_id
  question
  generated_sql
  safety_status
  execution_status
  row_count
  duration_ms
  error_message
  created_at
```

## Module Design

```txt
commerce-ai-platform/src/
  main.ts
  app.module.ts

  shared/
    api/
    config/
    database/

  modules/
    health/
    providers/
    core-data/
    vector-store/
    indexing/
    semantic-search/
    review-intelligence/
    sql-safety/
    analyst-chat/
    ai-logs/
```

### Providers

`EmbeddingProvider` returns vectors for product and query text. `LocalEmbeddingProvider` is deterministic and works offline. `OpenAiEmbeddingProvider` is selected only when configured.

`ChatProvider` is kept as an interface. MVP uses rule-based explanation and review analysis so the demo is stable without an LLM key.

### Core Data

`CoreDataService` reads a public-safe projection of products and reviews from PostgreSQL. It does not update marketplace tables. It builds source text for embeddings from title, brand, category, description, specs JSON, rating, and review count.

### Vector Store

`VectorStoreService` owns AI schema/table setup and vector queries. It prefers pgvector similarity and exposes a fallback in-memory cosine ranking for test/demo environments where pgvector is unavailable.

### Semantic Search

`SemanticSearchService` embeds the natural-language query, applies structured filters, searches indexed products, and returns ranked products with score and explanation.

### Review Intelligence

`ReviewIntelligenceService` analyzes reviews using deterministic rule-based logic. It stores per-review analysis and can summarize a product by aggregating positive/negative reviews and topics.

### Text-to-SQL Analyst

`SqlSafetyService` validates SQL before any execution. It allows only safe `SELECT` statements, requires whitelist tables, blocks mutation keywords, enforces `LIMIT`, and returns stable safety statuses. `AnalystChatService` is a skeleton that logs each question and either runs a safe generated query from a limited rule-based generator or returns a provider-not-configured response.

## Admin Integration

- `AiSearchPage` calls `POST /api/ai/search/products`.
- `ReviewIntelligencePage` calls review intelligence APIs and renders real unavailable/empty/error states.
- `AnalystChatPage` calls `POST /api/ai/analyst/chat` and displays safety status, answer, SQL, and result table if present.
- Frontend wrappers use `aiApi`; they must not call Core API for AI actions.

## Acceptance Criteria

- `commerce-ai-platform` builds and tests pass.
- `/api/health` returns service status.
- Product indexing creates or updates `ai.product_embeddings` idempotently.
- `POST /api/ai/search/products` returns ranked results for a seeded product dataset.
- Review analysis APIs return sentiment, topics, complaints, and praises.
- Text-to-SQL validator blocks mutation SQL and allows whitelisted `SELECT` with `LIMIT`.
- Admin AI pages call real AI APIs instead of showing placeholder-only UI.
- `.env.example` files contain placeholders only.
- Core service boundaries remain unchanged unless explicitly required by implementation.

## Verification Commands

```bash
cd commerce-ai-platform
npm test
npm run build

cd ../commerce-admin
npm test
npm run build

cd ..
git diff --check
```
