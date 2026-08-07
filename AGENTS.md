# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Repository Overview

Monorepo for the AI Commerce Marketplace Platform — an admin-first marketplace with AI semantic search, review intelligence, and text-to-SQL analyst.

Primary directories plus `docs/`:

| Directory | Stack | Status |
|---|---|---|
| `commerce-admin/` | React 19 + Vite 6 + Ant Design 5 | Implemented (base CMS with mock API) |
| `commerce-core-service-nestjs/` | NestJS 11 + TypeORM | Implemented current Core service |
| `commerce-core-service/` | Spring Boot Java | Original planned Core service; not used in this checkout |
| `commerce-ai-platform/` | NestJS | Not scaffolded |
| `commerce-platform-infra/` | Docker Compose (PostgreSQL+pgvector, Redis, MinIO) | Not scaffolded |

The current checkout uses `commerce-core-service-nestjs/` as the Core service implementation. The older planned Java `commerce-core-service/` remains part of the architecture docs but is not the active service in this repo. The root `docs/` folder defines service responsibilities, API contracts, and database models.

Design docs to read first: `docs/architecture/overview.md`, `docs/architecture/service-boundaries.md`, `docs/architecture/data-flow.md`, `docs/modules/database-model.md`.

## CodeGraph First

Before analyzing or modifying code in this repository, CodeGraph is mandatory.

From the repository root:

```bash
codegraph sync
```

If CodeGraph is not initialized:

```bash
codegraph init -i
```

Running `sync` or `init` is only the setup step. For code tasks, use CodeGraph as the first source for structure, symbol lookup, impact checks, and test selection before falling back to plain file reads:

```bash
codegraph files
codegraph query "<symbol-or-route-name>"
codegraph context "<task description>"
codegraph affected <changed-files>
```

If CodeGraph cannot run, state the exact failure and use `rg`/targeted reads as a fallback. Do not silently skip CodeGraph for code analysis or edits.

## commerce-core-service-nestjs Guidance

For any task inside `commerce-core-service-nestjs/`, read `commerce-core-service-nestjs/AGENTS.md` before analysis or edits. That service has its own agent docs and rulebook under `commerce-core-service-nestjs/docs/agent/`, especially `commerce-core-service-nestjs/docs/agent/rules.md`.

## Service Boundaries

- **commerce-admin**: Thin UI layer. Calls Core API for marketplace data, AI API for AI features. No business logic, no direct DB access.
- **commerce-core-service-nestjs / commerce-core-service**: Core service boundary. The active implementation is `commerce-core-service-nestjs/`. It owns `identity`, `marketplace`, `ingestion`, `analytics` schemas and provides auth, CRUD for marketplace entities, source/import flow, and analytics views.
- **commerce-ai-platform**: Owns `ai` schema only. Reads core data via Core API or PostgreSQL read-only user. Never writes to core tables. Provides embedding/chat provider abstraction, pgvector search, review intelligence, text-to-SQL analyst.
- **commerce-platform-infra**: Docker Compose entrypoint for running the full system locally.

## commerce-admin Architecture

### Commands (run from `commerce-admin/`)

```bash
npm install                   # Install dependencies
cp .env.example .env          # Create env file (defaults use mock API)
npm run dev                   # Start dev server (--host 0.0.0.0)
npm run build                 # TypeScript check + Vite production build
npm run test                  # Run Vitest once (--passWithNoTests)
npm run test:watch            # Vitest in watch mode
npm run lint                  # ESLint
npm run preview               # Preview production build
```

To run a single test file:
```bash
npx vitest run path/to/test.tsx
```

### Tech Stack

React 19, Vite 6, TypeScript 5.7 (strict), Ant Design 5.23, React Router 7, TanStack Query 5, Axios, Vitest 3 + Testing Library + jsdom.

### Project Structure

```
commerce-admin/src/
  main.tsx                    # Entry point: React.StrictMode > AppProviders > App
  app/
    App.tsx                   # Just renders <AppRoutes />
    AppProviders.tsx          # ConfigProvider (AntD theme) > QueryClientProvider > AuthProvider
  routes/
    AppRoutes.tsx             # BrowserRouter with public /login route + protected layout routes
    route-permissions.ts      # AdminRouteConfig[] mapping paths to PermissionCode (used by sidebar)
  layouts/
    AdminLayout.tsx           # AntD Layout: collapsible Sider (permission-filtered menu groups) + Header + <Outlet />
  modules/<feature>/
    FeaturePage.tsx           # Page component (default export pattern is named export)
    feature.api.ts            # API functions using coreApi or aiApi
    feature.types.ts          # TypeScript interfaces/types for the feature
    feature.store.tsx         # React Context store (only auth currently has one)
    feature.store.test.tsx    # Tests for the store
  shared/
    api/
      http-client.ts          # coreApi and aiApi (Axios instances), setAuthToken()
      mock-adapter.ts         # Axios response interceptor that returns mock data when VITE_USE_MOCK_API=true
    auth/
      PermissionGate.tsx      # Conditionally renders children based on user permission
    components/
      DataPageHeader.tsx      # Reusable page header with breadcrumb, title, description, refresh/actions
      StatusTag.tsx           # Colored AntD Tag mapped from status string
    config/
      env.ts                  # Typed env wrapper (VITE_CORE_API_BASE_URL, VITE_AI_API_BASE_URL, VITE_USE_MOCK_API)
    types/
      pagination.ts           # PageRequest, PageResponse<T>
```

### Key Patterns

**Auth flow**: `AuthProvider` (React Context) holds `token` (from localStorage) + `user`. `setSession()` stores token, calls `setAuthToken()` to attach Bearer header to both Axios instances. `clearSession()` removes everything. `useAuth()` hook throws if used outside provider.

**Permission model**: Resource:action strings (`product:read`, `ai:search`, etc.). Defined as `PermissionCode` union type in `auth.types.ts`. Sidebar filters menu items by permission. `PermissionGate` component conditionally renders children. Route guard in `ProtectedLayout` checks `auth.token` presence, not specific permissions — individual pages handle their own permission checks.

**Mock API**: When `VITE_USE_MOCK_API=true` (default), `installMockApi()` adds an Axios response error interceptor on `coreApi`. Failed requests to known endpoints (e.g. `POST /auth/login`, `GET /categories`) return hardcoded mock data instead of propagating the error. This lets the admin CMS run without a backend.

**API clients**: Two Axios instances — `coreApi` (base: `VITE_CORE_API_BASE_URL`, default `http://localhost:8080`) and `aiApi` (base: `VITE_AI_API_BASE_URL`, default `http://localhost:3001`). Both share the same auth token via `setAuthToken()`.

**Data fetching**: Pages use TanStack Query's `useQuery` with query keys like `['categories']`. API functions are thin wrappers around the Axios clients.

**Styling**: Inline styles via Ant Design's `style` prop with a custom theme token set in `AppProviders.tsx` (primary: `#2563eb`, font: Inter, dark sidebar: `#0f172a`). No CSS modules or styled-components.

### Environment Variables

| Variable | Default | Purpose |
|---|---|---|
| `VITE_CORE_API_BASE_URL` | `http://localhost:8080` | Core service base URL |
| `VITE_AI_API_BASE_URL` | `http://localhost:3001` | AI Platform base URL |
| `VITE_USE_MOCK_API` | `true` | Enable mock API interceptor |

## Database Schemas

Five logical schemas are documented: `identity` (users, permissions), `marketplace` (sellers, buyers, categories, products, variants, images, reviews, orders), `ingestion` (data_sources, sync_runs, raw_snapshots, source_products, source_reviews), `ai` (embeddings, analysis, chat sessions, query logs), `analytics` (views for text-to-SQL).

`commerce-core-service-nestjs/` currently implements the Core-owned schemas `identity`, `marketplace`, `ingestion`, and `analytics` with TypeORM entities and bootstrap schema setup. The future AI Platform owns `ai`.

Products use hybrid specs: `specs_json` (flexible JSONB) + `category_attributes` (defined filterable/searchable fields).

Identity has two user tables: `users` (admin/internal, with permissions) and `external_users` (sellers/buyers, no permission system). `sellers.user_id` and `buyers.user_id` are nullable FKs to `external_users`.

## Phase 1 Milestones

M1: Foundation + Catalog Admin (current state — admin CMS base complete)
M2: Review + Data Source/Import + realistic dataset
M3: Semantic Product Search (pgvector)
M4: Review Intelligence (sentiment, topics, summaries)
M5: Text-to-SQL Analyst (read-only SELECT with safety guardrails)

## Important Constraints

- `commerce-admin` must never query a database directly or contain marketplace business logic.
- AI Platform reads core data via read-only DB user or Core API; writes only to `ai` schema.
- Text-to-SQL must use read-only DB user, enforce SELECT-only, whitelist tables/columns, have query timeout, and log all queries.
- Admin is Vietnamese-language UI (`lang="vi"` in HTML, Vietnamese labels throughout).
- `commerce-core-service-nestjs/` is the tracked NestJS implementation of the Core service in this checkout.
