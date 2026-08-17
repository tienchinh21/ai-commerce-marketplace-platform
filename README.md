# AI Commerce Marketplace Platform

Enterprise AI-powered Commerce Marketplace Platform featuring Semantic Product Search (PostgreSQL + pgvector), Review Intelligence, and guarded Text-to-SQL Analyst.

## Services & Applications

| Directory | Stack | Status | Description |
|---|---|---|---|
| `commerce-admin/` | React 19 + Vite 6 + Ant Design 5 | Implemented | Admin CMS with full catalog management & live AI platform integration |
| `commerce-core-service-nestjs/` | NestJS 11 + TypeORM + PostgreSQL | Implemented | Core marketplace business logic, identity, ingestion & analytics |
| `commerce-ai-platform/` | NestJS 11 + pgvector + TypeORM | Implemented | Semantic Search, Review Intelligence & guarded Text-to-SQL Analyst |
| `commerce-platform-infra/` | Docker Compose | Implemented | PostgreSQL 16 + pgvector, Redis, MinIO local infrastructure |
| `docs/` | Markdown | Implemented | System architecture, data flow, API specs, and database schema docs |

## Key Features

1. **Semantic Product Search**: Natural-language product discovery powered by vector embeddings and cosine similarity on pgvector with hybrid structured filtering and match explanations.
2. **Review Intelligence**: Automated sentiment analysis, topic clustering, praise & complaint classification, and product-level review intelligence summaries.
3. **Guarded Text-to-SQL Analyst**: Safe conversational BI assistant enforcing read-only `SELECT` queries on `analytics` views with mutation blocking, table whitelisting, mandatory `LIMIT`, and audit logs.
4. **Admin CMS**: Modern Vietnamese admin interface for catalog, sellers, buyers, orders, ingestion pipelines, and AI capabilities.

## Getting Started

```bash
# 1. Start Infrastructure (PostgreSQL + pgvector, Redis, MinIO)
cd commerce-platform-infra
docker compose up -d

# 2. Start Core Service (port 8080)
cd ../commerce-core-service-nestjs
npm install
npm run start:dev

# 3. Start AI Platform (port 3001)
cd ../commerce-ai-platform
npm install
npm run start:dev

# 4. Start Admin CMS (port 5173)
cd ../commerce-admin
npm install
npm run dev
```
