# commerce-ai-platform

NestJS AI platform service providing Semantic Product Search (pgvector), Review Intelligence, and guarded Text-to-SQL Analyst.

## Responsibilities

- **Provider Abstraction**: Pluggable embedding and chat provider interface (`LocalEmbeddingProvider` deterministic hash, `OpenAiEmbeddingProvider`, `RuleBasedChatProvider`).
- **Vector Store**: Product vector embedding management in PostgreSQL `ai.product_embeddings` with pgvector similarity and cosine fallback.
- **Product Indexing**: Automated and on-demand indexing of active marketplace products.
- **Semantic Product Search**: Hybrid natural-language vector search with structured category/brand/price/rating filters and LLM match explanation.
- **Review Intelligence**: Rule-based sentiment scoring, topic extraction, complaints & praises classification, and aggregated product review summaries in `ai.review_ai_analysis`.
- **Text-to-SQL Analyst**: Safe reporting assistant with mutation blocking, table whitelisting, mandatory `LIMIT` guardrails, and audit logging in `ai.ai_query_logs`.

## Service Boundaries

- **Read-Only Core Access**: Reads products and reviews from `marketplace` schema and `analytics` views via read-only SQL queries. Never modifies `marketplace` or `identity` tables.
- **Exclusive AI Schema Ownership**: Writes only to `ai` schema (`ai.product_embeddings`, `ai.review_ai_analysis`, `ai.ai_query_logs`).
- **Global API Prefix**: All AI routes are served under `/api/ai/*`. Health check is at `/api/health`.

## API Endpoints

- `GET  /api/health` — Service health check
- `GET  /api/docs` — Swagger OpenAPI documentation
- `POST /api/ai/indexing/products/run` — Run indexing for all active products
- `POST /api/ai/indexing/products/:productId/run` — Run indexing for a specific product
- `GET  /api/ai/indexing/products/jobs/:jobId` — Check indexing job status
- `POST /api/ai/search/products` — Semantic product search with filters
- `POST /api/ai/reviews/analyze/run` — Analyze all approved reviews
- `POST /api/ai/reviews/:reviewId/analyze` — Analyze a single review
- `GET  /api/ai/products/:productId/review-summary` — Get aggregated review intelligence summary
- `GET  /api/ai/reviews/analysis` — List analyzed reviews
- `POST /api/ai/analyst/chat` — Safe Text-to-SQL analyst query
- `GET  /api/ai/query-logs` — Audit log of analyst queries

## Setup & Running

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Run in development mode
npm run start:dev

# Run tests
npm test

# Build production bundle
npm run build
```

## Demo Runbook

1. Start PostgreSQL + pgvector via `commerce-platform-infra/docker-compose.yml`.
2. Start `commerce-core-service-nestjs` (`npm run start:dev` on port 8080) to initialize and seed marketplace data.
3. Start `commerce-ai-platform` (`npm run start:dev` on port 3001).
4. Run product indexing: `curl -X POST http://localhost:3001/api/ai/indexing/products/run`.
5. Run semantic search query: `curl -X POST http://localhost:3001/api/ai/search/products -H "Content-Type: application/json" -d '{"query":"kem chống nắng cho da dầu"}'`.
6. Run review intelligence: `curl -X POST http://localhost:3001/api/ai/reviews/analyze/run`.
7. Ask AI Analyst: `curl -X POST http://localhost:3001/api/ai/analyst/chat -H "Content-Type: application/json" -d '{"question":"Top 10 sản phẩm doanh thu cao nhất"}'`.
8. Open `commerce-admin` and test the UI on `/ai-search`, `/review-intelligence`, and `/analyst-chat`.
