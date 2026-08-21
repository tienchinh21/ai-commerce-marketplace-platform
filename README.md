# AI Commerce Marketplace Platform ⚡

<p align="left">
  <img src="https://img.shields.io/badge/NestJS_11-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/PostgreSQL_16_%2B_pgvector-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL pgvector" />
  <img src="https://img.shields.io/badge/Ant_Design_5-0170FE?style=for-the-badge&logo=antdesign&logoColor=white" alt="Ant Design" />
  <img src="https://img.shields.io/badge/Docker_Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
</p>

Enterprise AI-powered Commerce Marketplace Platform featuring **Semantic Product Search** (PostgreSQL 16 + pgvector), **Review Intelligence**, and **Guarded Text-to-SQL Analyst**.

---

## 🏗️ System Architecture & Services

```text
ai-commerce-marketplace-platform/
├── commerce-admin/                 # React 19 + Vite 6 + Ant Design 5 Admin CMS
├── commerce-core-service-nestjs/   # NestJS 11 + TypeORM + PostgreSQL 16 Core Service
├── commerce-ai-platform/           # NestJS 11 + pgvector + TypeORM AI Intelligence Engine
├── commerce-platform-infra/        # Docker Compose (PostgreSQL 16 + pgvector, Redis, MinIO)
└── docs/                           # Architecture, Data Flow, and API Specs
```

| Directory | Stack | Description |
|---|---|---|
| `commerce-admin/` | React 19 + Vite 6 + Ant Design 5 + TanStack Query | Admin CMS with full catalog management, live dashboards & AI interfaces |
| `commerce-core-service-nestjs/` | NestJS 11 + TypeORM + PostgreSQL | Marketplace business logic, identity (JWT/RBAC), raw snapshots, ingestion & analytics |
| `commerce-ai-platform/` | NestJS 11 + pgvector + TypeORM | Semantic search embeddings, Review Sentiment clustering & safe Text-to-SQL engine |
| `commerce-platform-infra/` | Docker Compose | Local containerized infra: PostgreSQL 16 with pgvector extension, Redis cache, MinIO |

---

## 🚀 Key Technical Features

1. **Semantic Product Search (Vector Embeddings):**
   - Natural-language product discovery powered by vector embeddings and cosine similarity on `PostgreSQL + pgvector`.
   - Hybrid filtering supporting category taxonomy, price range, stock availability, and match explanations.

2. **Review Intelligence & Sentiment Clustering:**
   - Automated sentiment analysis, praise vs. complaint topic extraction, and product-level intelligence summaries.

3. **Guarded Text-to-SQL Analyst:**
   - Safe conversational business intelligence assistant enforcing read-only `SELECT` queries on `analytics` materialized views.
   - Guardrails include mutation blocking, table whitelisting, mandatory `LIMIT`, and comprehensive audit logs.

4. **Enterprise Admin CMS:**
   - Comprehensive backoffice with reusable tables, dynamic filters, pagination, seller/buyer management, category trees, and AI operation interfaces.

---

## 🏁 Getting Started

### 1. Start Infrastructure (PostgreSQL + pgvector, Redis, MinIO)
```bash
cd commerce-platform-infra
docker compose up -d
```

### 2. Start Core Service (Port 8080)
```bash
cd ../commerce-core-service-nestjs
npm install
npm run start:dev
```

### 3. Start AI Platform Service (Port 3001)
```bash
cd ../commerce-ai-platform
npm install
npm run start:dev
```

### 4. Start Admin CMS (Port 5173)
```bash
cd ../commerce-admin
npm install
npm run dev
```

---

## 📚 Documentation

Detailed documentation is available in the [`docs/`](docs/) directory:
- [System Architecture](docs/architecture.md)
- [Database Schema & ERD](docs/database-schema.md)
- [API Specifications](docs/api-specs.md)
