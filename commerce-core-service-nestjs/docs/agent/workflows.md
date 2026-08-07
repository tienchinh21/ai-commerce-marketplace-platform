# Agent Workflows

## Before Work

CodeGraph is mandatory before code analysis or edits.

From repository root, sync the index:

```bash
codegraph sync
```

If CodeGraph is missing:

```bash
codegraph init -i
```

Do not stop at sync/init. Use CodeGraph to understand the task before opening source files directly:

```bash
codegraph files
codegraph query "<symbol-or-route-name>"
codegraph context "<task description>"
```

When files have changed and you need to choose verification scope:

```bash
codegraph affected <changed-files>
```

Then inspect only relevant files with `rg`, `rg --files`, and targeted reads.

If CodeGraph is unavailable or fails, record the exact failure and continue with `rg` plus targeted reads as the fallback.

## Install And Run

From `commerce-core-service-nestjs/`:

```bash
npm install
cp .env.example .env
npm run start:dev
```

Health check:

```bash
curl http://localhost:8080/api/health
```

CMS login:

```bash
curl -X POST http://localhost:8080/api/cms/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

## Verification

Use the narrowest meaningful test first:

```bash
npm test -- cms-products.controller.spec.ts
```

Then broader verification:

```bash
npm test
npm run build
```

Use lint only when style changes are in scope:

```bash
npm run lint
```

Note: `npm run lint` uses `--fix`, so it may edit files. Check the diff after running it.

## Safe Edit Rules

- Do not edit `dist/` or `node_modules/`.
- Do not change route paths, permissions, schemas, or response shape unless the task explicitly asks.
- Do not use TypeORM entities as public controller response types.
- Do not add a client endpoint inside a CMS controller.
- Do not add a CMS endpoint inside a client controller.
- Do not expose admin-only data in client DTOs.
- Preserve unrelated worktree changes.

## Adding A New CMS Endpoint

1. Add or update `cms-*.controller.ts`.
2. Add input DTO under `dto/cms/` if needed.
3. Add response DTO under `dto/cms/`.
4. Add a service method with CMS naming if rules differ from client behavior.
5. Protect the route with `@Permissions('product:write')` or the matching permission code.
6. Add controller/service tests.
7. Run targeted tests and `npm run build`.

## Adding A New Client Endpoint

1. Add `client-*.controller.ts`.
2. Use `@Public()` for public routes or client auth guard when implemented.
3. Add response DTO under `dto/client/`.
4. Add a service method with client naming.
5. Filter to public-safe records only, usually `status = 'ACTIVE'`.
6. Do not return internal IDs or workflow fields unless needed by the client contract.
7. Add tests proving internal fields are not returned.
8. Run targeted tests and `npm run build`.

## Rename Workflow For CMS Controllers

When renaming generic controllers to explicit CMS names:

1. Rename file, class, imports, test file, and module registration together.
2. Keep route decorators unchanged, for example `@Controller('cms/products')`.
3. Keep response DTOs and service behavior unchanged unless part of the same planned task.
4. Run the matching controller spec.
5. Run `npm run build`.
