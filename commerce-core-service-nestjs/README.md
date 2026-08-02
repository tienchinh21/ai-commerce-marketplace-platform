# commerce-core-service-nestjs

NestJS implementation of the marketplace core service (replaces the long-awaited Java `commerce-core-service`).

> ⚠️ **Git-ignored**: developed independently. Contracts live in the main repo: `docs/core-service/implementation-brief.md`, `docs/api-contracts/core-api.md`, `docs/modules/database-model.md`.

## Stack

- NestJS 11 + TypeORM + PostgreSQL (pgvector) + JWT auth + bcryptjs
- Owns schemas: `identity`, `marketplace`, `ingestion`, `analytics`

## Local Development

```bash
# 1. Start infra (from commerce-platform-infra/)
docker compose up -d

# 2. Install + configure
npm install
cp .env.example .env

# 3. Run
npm run start:dev
```

## Verify

```bash
# Health
curl http://localhost:8080/api/health

# Login (seeded automatically on first boot)
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

## Seeded Data (auto on first boot, `DB_SEED=true`)

- Admin user: `admin@example.com` / `admin123` with all 16 permissions
- 5 categories with attributes, 10 sellers, 25 products, 30 buyers, ~87 reviews

## API Groups (prefix `/api`)

- `POST /auth/login`, `GET /auth/me`, `GET /auth/me/permissions`
- `GET/POST /users`, `GET /permissions`, `PUT /users/:id/permissions`
- `GET/POST /categories`, `GET/PATCH/DELETE /categories/:id`, attributes endpoints
- `GET/POST /sellers`, `GET/PATCH /sellers/:id`
- `GET/POST /buyers`, `GET/PATCH /buyers/:id`
- `GET/POST /products`, `GET/PATCH/DELETE /products/:id`, variants, images
- `GET/POST /reviews`, `GET/PATCH /reviews/:id`
- `GET/POST /orders`, `GET /orders/:id`
- `GET/POST /data-sources`, `GET /sync-runs`, `GET /raw-snapshots`, `POST /imports/products|reviews`
- `GET /analytics/product-performance|review-sentiment|seller-performance|category-summary`

All endpoints except `/auth/login` and `/health` require `Authorization: Bearer <token>`. Permissions are enforced server-side via `@Permissions('resource:action')`.

## Env (`.env`)

```env
PORT=8080
DB_HOST=localhost
DB_PORT=5432          # Docker Postgres
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=commerce
DB_SYNCHRONIZE=true   # auto-create tables from entities
DB_SEED=true          # seed admin + sample data on boot
JWT_SECRET=change-me-in-production
JWT_EXPIRES_IN=8h
CORS_ORIGINS=http://localhost:5173
```
