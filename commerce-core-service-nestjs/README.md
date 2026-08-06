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
curl -X POST http://localhost:8080/api/cms/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

## Seeded Data (auto on first boot, `DB_SEED=true`)

- Admin user: `admin@example.com` / `admin123` with all 16 permissions
- 5 categories with attributes, 10 sellers, 25 products, 30 buyers, ~87 reviews

## CMS API Groups (prefix `/api/cms`)

- `POST /cms/auth/login`, `GET /cms/auth/me`, `GET /cms/auth/me/permissions`
- `GET/POST /cms/users`, `GET /cms/permissions`, `PUT /cms/users/:id/permissions`
- `GET/POST /cms/categories`, `GET/PATCH/DELETE /cms/categories/:id`, attributes endpoints
- `GET/POST /cms/sellers`, `GET/PATCH /cms/sellers/:id`
- `GET/POST /cms/buyers`, `GET/PATCH /cms/buyers/:id`
- `GET/POST /cms/products`, `GET/PATCH/DELETE /cms/products/:id`, variants, images
- `GET/POST /cms/reviews`, `GET/PATCH /cms/reviews/:id`
- `GET/POST /cms/orders`, `GET /cms/orders/:id`
- `GET/POST /cms/data-sources`, `GET /cms/sync-runs`, `GET /cms/raw-snapshots`, `POST /cms/imports/products|reviews`
- `GET /cms/analytics/product-performance|review-sentiment|seller-performance|category-summary`

All endpoints except `/cms/auth/login` and `/health` require `Authorization: Bearer <token>`. Permissions are enforced server-side via `@Permissions('resource:action')`.

## CMS API Response Policy

- GET endpoints return explicit response DTOs, not TypeORM entities.
- POST create endpoints return `201 Created` with `{ "success": true, "id": "...", "message": "..." }`.
- PATCH and PUT endpoints return `200 OK` with `{ "success": true, "message": "..." }`.
- DELETE endpoints return `204 No Content`.
- Import endpoints return a compact sync run summary with `syncRunId`, `status`, `totalRecords`, `successCount`, and `failedCount`.
- Sensitive or heavy persistence fields such as `passwordHash`, `configJson`, and `rawJson` are not returned from CMS API responses by default.

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
