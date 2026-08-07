# CMS Route Segmentation Implementation Plan

> **Status:** Completed / historical. Current business routes are already under `/api/cms/*`, current controller files are `cms-*.controller.ts`, and future client routes remain unimplemented. Do not execute this plan as-is.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move every existing commerce-core-service-nestjs business API behind `/api/cms/*` so the service can clearly separate CMS/admin APIs from future client-facing APIs.

**Architecture:** Keep the current modules, services, entities, DTOs, JWT guard, and permission guard intact. Change the HTTP route surface by adding a CMS prefix to existing controllers, leaving `/api/health` and `/api/docs` unchanged. Reserve `/api/client/*` for future storefront or external-user APIs and do not expose current CMS CRUD endpoints there.

**Tech Stack:** NestJS 11, TypeScript, TypeORM, Passport JWT, class-validator, Jest/Supertest-compatible Nest testing.

## Global Constraints

- All existing marketplace, ingestion, analytics, user, permission, and admin auth endpoints are CMS endpoints.
- Do not change database schemas, entities, service method names, seed data, permission codes, or response shapes during the route migration.
- Preserve the global prefix `app.setGlobalPrefix('api')`.
- Keep `GET /api/health` public.
- Keep Swagger mounted at `/api/docs`; update tags/descriptions to show CMS routes.
- New CMS namespace is `/api/cms`.
- Future client namespace is reserved as `/api/client`; no client controller is implemented in this migration.
- Keep Vietnamese admin UI contract compatibility by updating commerce-admin API paths in the same migration.
- Add compatibility redirects only if explicitly required by the caller; the default plan is a clean route move with tests.

---

## Historical Route Assessment

At the time this plan was written, the service had one API namespace, `/api`, and every controller was mounted directly under it:

- `/api/auth/*`
- `/api/users`, `/api/permissions`, `/api/users/:id/permissions`
- `/api/categories/*`
- `/api/sellers/*`
- `/api/buyers/*`
- `/api/products/*`
- `/api/reviews/*`
- `/api/orders/*`
- `/api/data-sources/*`, `/api/imports/*`, `/api/sync-runs/*`, `/api/raw-snapshots/*`
- `/api/analytics/*`

These endpoints all use the admin/internal `identity.users` login and permission model, so they should be treated as CMS APIs.

## Target Route Map

Public/system routes that stay in place:

```txt
GET /api/health
GET /api/docs
```

CMS auth:

```txt
POST /api/cms/auth/login
GET /api/cms/auth/me
GET /api/cms/auth/me/permissions
```

CMS users and permissions:

```txt
GET /api/cms/users
POST /api/cms/users
GET /api/cms/permissions
GET /api/cms/users/:id/permissions
PUT /api/cms/users/:id/permissions
```

CMS catalog and marketplace:

```txt
GET /api/cms/categories
POST /api/cms/categories
GET /api/cms/categories/:id
PATCH /api/cms/categories/:id
DELETE /api/cms/categories/:id
GET /api/cms/categories/:id/attributes
POST /api/cms/categories/:id/attributes
PATCH /api/cms/categories/attributes/:attributeId
DELETE /api/cms/categories/attributes/:attributeId

GET /api/cms/sellers
POST /api/cms/sellers
GET /api/cms/sellers/:id
PATCH /api/cms/sellers/:id

GET /api/cms/buyers
POST /api/cms/buyers
GET /api/cms/buyers/:id
PATCH /api/cms/buyers/:id

GET /api/cms/products
POST /api/cms/products
GET /api/cms/products/:id
PATCH /api/cms/products/:id
DELETE /api/cms/products/:id
GET /api/cms/products/:id/variants
POST /api/cms/products/:id/variants
POST /api/cms/products/:id/images

GET /api/cms/reviews
POST /api/cms/reviews
GET /api/cms/reviews/:id
PATCH /api/cms/reviews/:id

GET /api/cms/orders
POST /api/cms/orders
GET /api/cms/orders/:id
```

CMS ingestion:

```txt
GET /api/cms/data-sources
POST /api/cms/data-sources
GET /api/cms/data-sources/:id
PATCH /api/cms/data-sources/:id
GET /api/cms/sync-runs
GET /api/cms/sync-runs/:id
GET /api/cms/raw-snapshots
GET /api/cms/raw-snapshots/:id
POST /api/cms/imports/products
POST /api/cms/imports/reviews
```

CMS analytics:

```txt
GET /api/cms/analytics/product-performance
GET /api/cms/analytics/review-sentiment
GET /api/cms/analytics/seller-performance
GET /api/cms/analytics/category-summary
```

Reserved future client routes:

```txt
GET /api/client/categories
GET /api/client/products
GET /api/client/products/:slug
GET /api/client/sellers/:slug
POST /api/client/auth/register
POST /api/client/auth/login
GET /api/client/account/orders
```

The reserved client routes are examples only. They must be implemented later with separate DTOs, separate response projections, and external-user authentication.

## File Structure

- Modify: `commerce-core-service-nestjs/src/modules/auth/auth.controller.ts`
  - Change controller path from `auth` to `cms/auth`.
- Modify: `commerce-core-service-nestjs/src/modules/users-permissions/users-permissions.controller.ts`
  - Change class-level controller path from empty to `cms`.
- Modify: `commerce-core-service-nestjs/src/modules/categories/categories.controller.ts`
  - Change controller path from `categories` to `cms/categories`.
- Modify: `commerce-core-service-nestjs/src/modules/sellers/sellers.controller.ts`
  - Change controller path from `sellers` to `cms/sellers`.
- Modify: `commerce-core-service-nestjs/src/modules/buyers/buyers.controller.ts`
  - Change controller path from `buyers` to `cms/buyers`.
- Modify: `commerce-core-service-nestjs/src/modules/products/products.controller.ts`
  - Change controller path from `products` to `cms/products`.
- Modify: `commerce-core-service-nestjs/src/modules/reviews/reviews.controller.ts`
  - Change controller path from `reviews` to `cms/reviews`.
- Modify: `commerce-core-service-nestjs/src/modules/orders/orders.controller.ts`
  - Change controller path from `orders` to `cms/orders`.
- Modify: `commerce-core-service-nestjs/src/modules/ingestion/ingestion.controller.ts`
  - Change class-level controller path from empty to `cms`.
- Modify: `commerce-core-service-nestjs/src/modules/analytics/analytics.controller.ts`
  - Change controller path from `analytics` to `cms/analytics`.
- Modify: `commerce-core-service-nestjs/README.md`
  - Update curl examples and API group list to `/api/cms/*`.
- Modify: `commerce-core-service-nestjs/src/app.controller.spec.ts`
  - Keep health test pointed at `/api/health` behavior if present.
- Create: `commerce-core-service-nestjs/test/cms-routes.e2e-spec.ts`
  - Add route-level regression coverage for CMS prefix and old unprefixed routes.
- Modify: `commerce-admin/src/shared/api/http-client.ts` or feature API wrappers if they use path constants directly.
  - Point Core API calls to `/cms/*` while preserving `VITE_CORE_API_BASE_URL=http://localhost:8080/api`.
- Modify: `commerce-admin/src/shared/api/mock-adapter.ts`
  - Accept `/cms/*` mock paths so local CMS keeps working without backend.

## Implementation Tasks

### Task 1: Add CMS Prefix To Core Controllers

**Files:**
- Modify: `commerce-core-service-nestjs/src/modules/auth/auth.controller.ts`
- Modify: `commerce-core-service-nestjs/src/modules/users-permissions/users-permissions.controller.ts`
- Modify: `commerce-core-service-nestjs/src/modules/categories/categories.controller.ts`
- Modify: `commerce-core-service-nestjs/src/modules/sellers/sellers.controller.ts`
- Modify: `commerce-core-service-nestjs/src/modules/buyers/buyers.controller.ts`
- Modify: `commerce-core-service-nestjs/src/modules/products/products.controller.ts`
- Modify: `commerce-core-service-nestjs/src/modules/reviews/reviews.controller.ts`
- Modify: `commerce-core-service-nestjs/src/modules/orders/orders.controller.ts`
- Modify: `commerce-core-service-nestjs/src/modules/ingestion/ingestion.controller.ts`
- Modify: `commerce-core-service-nestjs/src/modules/analytics/analytics.controller.ts`

**Interfaces:**
- Consumes: existing NestJS controller decorators and existing service methods.
- Produces: CMS routes mounted under `/api/cms/*` with unchanged handlers, DTOs, guards, permissions, and response bodies.

- [ ] **Step 1: Update controller-level paths**

Use these exact decorator changes:

```ts
// auth.controller.ts
@Controller('cms/auth')

// users-permissions.controller.ts
@Controller('cms')

// categories.controller.ts
@Controller('cms/categories')

// sellers.controller.ts
@Controller('cms/sellers')

// buyers.controller.ts
@Controller('cms/buyers')

// products.controller.ts
@Controller('cms/products')

// reviews.controller.ts
@Controller('cms/reviews')

// orders.controller.ts
@Controller('cms/orders')

// ingestion.controller.ts
@Controller('cms')

// analytics.controller.ts
@Controller('cms/analytics')
```

- [ ] **Step 2: Leave method-level routes unchanged**

Do not rename method decorators such as:

```ts
@Get('data-sources')
@Post('imports/products')
@Get(':id/variants')
@Patch('attributes/:attributeId')
```

With the class prefix in place, they become the target CMS routes automatically.

- [ ] **Step 3: Run TypeScript check**

Run:

```bash
cd commerce-core-service-nestjs
npm run build
```

Expected: build succeeds without TypeScript errors.

### Task 2: Add CMS Route Regression Tests

**Files:**
- Create: `commerce-core-service-nestjs/test/cms-routes.e2e-spec.ts`
- Create: `commerce-core-service-nestjs/test/jest-e2e.json`
- Modify: `commerce-core-service-nestjs/package.json` only if the existing `test:e2e` command is missing.

**Interfaces:**
- Consumes: `AppModule`, seeded admin auth assumptions, existing guards.
- Produces: automated proof that CMS routes use `/api/cms/*` and representative old routes are no longer mounted.
- Runtime requirement: a local PostgreSQL test/dev database must be reachable through `.env` because `AppModule` initializes TypeORM.

- [ ] **Step 1: Create e2e test skeleton**

Create `commerce-core-service-nestjs/test/cms-routes.e2e-spec.ts`:

```ts
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
});
```

- [ ] **Step 2: Add e2e Jest config**

Create `commerce-core-service-nestjs/test/jest-e2e.json`:

```json
{
  "moduleFileExtensions": ["js", "json", "ts"],
  "rootDir": ".",
  "testEnvironment": "node",
  "testRegex": ".e2e-spec.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  }
}
```

- [ ] **Step 3: Confirm the e2e script exists**

If `package.json` has no e2e command, add:

```json
{
  "scripts": {
    "test:e2e": "jest --config ./test/jest-e2e.json"
  }
}
```

The current repository already defines `test:e2e`; keep it unchanged if it still points at `./test/jest-e2e.json`.

- [ ] **Step 4: Run route tests**

Run:

```bash
cd commerce-core-service-nestjs
npm run test:e2e -- cms-routes.e2e-spec.ts
```

Expected: tests pass with local PostgreSQL available. If local infra is unavailable, run `npm run build` and record e2e as blocked by missing database in the final implementation notes.

### Task 3: Update Admin Client Paths

**Files:**
- Modify: `commerce-admin/src/shared/api/http-client.ts`
- Modify: `commerce-admin/src/shared/api/mock-adapter.ts`
- Modify: feature API wrappers under `commerce-admin/src/modules/**` if they call unprefixed Core paths directly.

**Interfaces:**
- Consumes: existing `coreApi` Axios instance and existing feature API wrapper functions.
- Produces: admin CMS frontend calls `/api/cms/*` routes without changing page components or response handling.

- [ ] **Step 1: Find current Core API path usage**

Run:

```bash
rg -n "coreApi\\.(get|post|patch|put|delete)|/auth|/products|/categories|/sellers|/buyers|/reviews|/orders|/data-sources|/imports|/analytics|/users|/permissions" commerce-admin/src
```

Expected: list of wrappers and mock adapter paths that need `/cms` added.

- [ ] **Step 2: Add a single path helper if paths are scattered**

If multiple feature wrappers pass string literals directly to `coreApi`, add this helper near the Axios instances:

```ts
export const cmsPath = (path: string) =>
  path.startsWith('/') ? `/cms${path}` : `/cms/${path}`;
```

Then update calls from:

```ts
coreApi.get('/products')
coreApi.post('/auth/login', body)
```

to:

```ts
coreApi.get(cmsPath('/products'))
coreApi.post(cmsPath('/auth/login'), body)
```

- [ ] **Step 3: Update mock adapter matching**

Update mock matching so mocked Core responses handle `/cms/...` paths. If the mock adapter normalizes `config.url`, normalize by removing a leading `/cms` before the switch:

```ts
const rawPath = config.url ?? '';
const path = rawPath.startsWith('/cms/') ? rawPath.slice('/cms'.length) : rawPath;
```

This keeps mock data definitions stable while accepting the new CMS prefix.

- [ ] **Step 4: Run admin verification**

Run:

```bash
cd commerce-admin
npm run build
npm run test
```

Expected: build and tests pass.

### Task 4: Update Documentation And API Contract

**Files:**
- Modify: `commerce-core-service-nestjs/README.md`
- Modify: `docs/api-contracts/core-api.md`

**Interfaces:**
- Consumes: target route map in this plan.
- Produces: docs that explicitly say current Core API routes are CMS routes and future client APIs must use `/api/client`.

- [ ] **Step 1: Update service README examples**

Change examples from:

```bash
curl -X POST http://localhost:8080/api/auth/login
```

to:

```bash
curl -X POST http://localhost:8080/api/cms/auth/login
```

Change the API group heading from:

```md
## API Groups (prefix `/api`)
```

to:

```md
## CMS API Groups (prefix `/api/cms`)
```

- [ ] **Step 2: Update root API contract**

In `docs/api-contracts/core-api.md`, add:

```md
Core API hiện tại phục vụ Admin CMS. Các route hiện tại dùng prefix `/api/cms`.
Client/storefront API sau này dùng prefix riêng `/api/client` và không dùng chung DTO/response với CMS API.
```

Then add `/cms` to all current endpoint examples.

- [ ] **Step 3: Run documentation grep**

Run:

```bash
rg -n "/api/(auth|products|categories|sellers|buyers|reviews|orders|data-sources|imports|analytics|users|permissions)" commerce-core-service-nestjs README.md docs commerce-admin/src
```

Expected: no stale docs or code examples for old unprefixed CMS routes, except when intentionally documenting old routes as removed.

### Task 5: Verify No Client API Is Accidentally Exposed

**Files:**
- Modify only if a stale route remains after Task 1.

**Interfaces:**
- Consumes: Nest route metadata after controller prefix changes.
- Produces: confidence that `/api/client/*` is unused and `/api/*` no longer exposes CMS resources directly.

- [ ] **Step 1: Start the service locally**

Run:

```bash
cd commerce-core-service-nestjs
npm run start:dev
```

Expected: service starts on configured port, usually `http://localhost:8080`.

- [ ] **Step 2: Probe representative routes**

Run in another terminal:

```bash
curl -i http://localhost:8080/api/health
curl -i http://localhost:8080/api/products
curl -i http://localhost:8080/api/cms/products
curl -i http://localhost:8080/api/client/products
```

Expected:

```txt
/api/health -> 200
/api/products -> 404
/api/cms/products -> 401 without token, 200 with valid admin token
/api/client/products -> 404
```

- [ ] **Step 3: Verify CMS login**

Run:

```bash
curl -X POST http://localhost:8080/api/cms/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

Expected: JWT access token and admin user payload with permissions.

## Acceptance Criteria

- Every existing Core business endpoint is reachable only under `/api/cms/*`.
- `/api/health` and `/api/docs` still work at their current paths.
- Representative old routes such as `/api/auth/login` and `/api/products` return 404.
- No `/api/client/*` business route exists yet.
- commerce-admin works against the new CMS prefix in both mock and real API modes.
- Build and focused route tests pass for `commerce-core-service-nestjs`.
- Build and existing tests pass for `commerce-admin`.

## Rollout Notes

- This is a breaking API path change for current consumers.
- Because the only intended consumer today is CMS/admin, update `commerce-admin` in the same branch.
- Do not add backward-compatible aliases unless another active consumer depends on old paths.
- If aliases are required later, implement them as temporary redirects or duplicated controller aliases with a removal date documented in README.

## Self-Review

- Placeholder scan: no unresolved placeholders are intentionally left in this plan.
- Scope check: this plan is limited to route namespace separation and admin client path updates.
- Ambiguity check: CMS prefix is explicitly `/api/cms`; future client prefix is explicitly reserved as `/api/client`.
- Risk check: auth, permission, database, service logic, and response contracts remain unchanged.
