# AGENTS.md

Scoped instructions for AI agents working inside `commerce-core-service-nestjs/`.

## Read First

Before analysis or edits in this service, read these reference files:

1. `docs/agent/README.md` - quick orientation and source-of-truth map.
2. `docs/agent/architecture.md` - NestJS module, database, auth, and response architecture.
3. `docs/agent/api-boundaries.md` - CMS/client route boundary and naming rules.
4. `docs/agent/workflows.md` - commands, verification, and safe-change workflow.
5. `docs/agent/known-plans.md` - active implementation plans and current cleanup priorities.

Also keep the repo-level `../AGENTS.md` constraints in force.

## Core Rules

- Run `codegraph sync` from the repository root before code analysis or edits. If CodeGraph is not initialized, run `codegraph init -i`.
- Treat `src/modules/<domain>/` as a domain module, not as a CMS-only folder. Audience is expressed by controller names, route prefixes, DTO folders, and auth guards.
- Current implemented APIs are CMS APIs under `/api/cms/*`.
- Future client APIs must use `/api/client/*`, client-specific controllers, client-specific DTOs, and public/external-user auth rules.
- CMS controllers must be named `cms-*.controller.ts` / `Cms*Controller`; future client controllers must be named `client-*.controller.ts` / `Client*Controller`.
- CMS DTOs live under `dto/cms/`. Add future client DTOs under `dto/client/` without moving the domain module or shared service.
- Do not expose TypeORM entities directly from controllers. Use response DTOs and serialization helpers.
- Client-facing API messages should be Vietnamese. Error responses should include stable codes.
- Do not edit `dist/`, `node_modules/`, generated build artifacts, or unrelated service directories.
- Keep changes small and verifiable. Prefer targeted tests plus `npm run build`.

## Commands

Run from `commerce-core-service-nestjs/`:

```bash
npm install
cp .env.example .env
npm run start:dev
npm test
npm run build
npm run lint
```

Run a focused Jest file:

```bash
npm test -- cms-products.controller.spec.ts
```

## Naming Direction

Controllers are route-prefixed and audience-prefixed. Keep this structure when adding or changing routes:

```txt
cms-products.controller.ts       -> CmsProductsController -> /api/cms/products
client-products.controller.ts    -> ClientProductsController -> /api/client/products
products.service.ts              -> shared domain/application service
dto/cms/*                        -> CMS response/input DTOs
dto/client/*                     -> client-facing DTOs
```

Do not add generic `products.controller.ts` / `ProductsController` files for audience routes. Add a new `client-*` controller beside the existing `cms-*` controller when introducing `/api/client/*`.
