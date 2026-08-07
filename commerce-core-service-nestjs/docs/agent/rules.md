# Agent Rules For Commerce Core NestJS

These rules are the working contract for AI agents changing `commerce-core-service-nestjs/`. They turn the current project patterns into concrete do/don't checks.

## Non-Negotiable Rules

- Use CodeGraph before code analysis or edits; `sync/init` alone is not enough.
- Read current source before trusting older plan files.
- Keep `src/modules/<domain>/` as the domain folder; put CMS/client ownership in controller names, route prefixes, DTO folders, and auth policy.
- Use `cms-*.controller.ts` / `Cms*Controller` for current CMS routes and reserve `client-*.controller.ts` / `Client*Controller` for future client routes.
- Keep CMS DTOs under `dto/cms/` and future client DTOs under `dto/client/`.
- Do not return TypeORM entities directly from controllers.
- Use lean mutation responses and Vietnamese client-facing messages with stable error codes.
- Do not mix CMS permissions with future client/external-user routes.
- Run focused tests plus `npm run build` for code changes, or report the exact verification gap.

## Rule Priority

If rules conflict, follow this order:

1. User request in the current chat.
2. `commerce-core-service-nestjs/AGENTS.md`.
3. This file.
4. Other files under `docs/agent/`.
5. Repo-level `../AGENTS.md`.

Never ignore a higher-priority instruction because a lower-priority doc is more convenient.

## Context Rules

### RULE-CONTEXT-001: CodeGraph Is Mandatory Before Analysis

Before analyzing or editing service code, use CodeGraph from the monorepo root.

First sync the index:

```bash
codegraph sync
```

If CodeGraph has not been initialized, run:

```bash
codegraph init -i
```

Sync/init is not enough by itself. For source tasks, use CodeGraph as the first source for structure, references, impact, and test selection before plain file reads.

Use the command that matches the task:

```bash
codegraph files
codegraph query "<symbol-or-route-name>"
codegraph context "<task description>"
codegraph affected <changed-files>
```

Examples:

```bash
codegraph query "CmsProductsController"
codegraph query "ProductsService"
codegraph context "change CMS product mutation response contract"
codegraph affected commerce-core-service-nestjs/src/modules/products/cms-products.controller.ts
```

Then inspect relevant files with `rg`, `rg --files`, and targeted reads.

If CodeGraph cannot run, state the exact failure in the final response and continue with `rg` plus targeted reads as an explicit fallback. Do not silently skip CodeGraph for source analysis or edits.

### RULE-CONTEXT-002: Read The Local Agent Docs First

For work inside this service, read these files before making changes:

```txt
commerce-core-service-nestjs/AGENTS.md
commerce-core-service-nestjs/docs/agent/README.md
commerce-core-service-nestjs/docs/agent/rules.md
commerce-core-service-nestjs/docs/agent/architecture.md
commerce-core-service-nestjs/docs/agent/api-boundaries.md
commerce-core-service-nestjs/docs/agent/workflows.md
commerce-core-service-nestjs/docs/agent/known-plans.md
```

Read relevant current source files before assuming docs are fully up to date.

### RULE-CONTEXT-003: Keep Changes Scoped

Touch only files required by the requested task. Do not reformat unrelated files, rewrite modules broadly, or modify sibling services unless the user explicitly asks.

## Module And Folder Rules

### RULE-MODULE-001: Domain Folder Is Not API Audience

Keep `src/modules/<domain>/` as the domain boundary.

Good:

```txt
src/modules/products/
src/modules/categories/
src/modules/orders/
```

Bad:

```txt
src/modules/cms-products/
src/modules/client-products/
```

CMS/client ownership belongs in controller names, route prefixes, DTO folders, and auth policy.

### RULE-MODULE-002: Keep Shared Logic In Domain Services

Use `products.service.ts`, `orders.service.ts`, and other domain services for shared application logic. Add audience-specific service methods only when rules or returned data differ.

Good:

```ts
listCmsProducts(query)
getCmsProductDetail(id)
listClientProducts(query)
getClientProductBySlug(slug)
```

Bad:

```ts
listProductsForEverything(query)
```

Do not reuse a CMS method in a client controller if it returns internal fields.

### RULE-MODULE-003: Avoid Circular Dependencies

Do not introduce circular module imports. Prefer moving shared types/helpers to a small local shared file or using a service method on the owning domain.

## Controller And Route Rules

### RULE-API-001: Business Routes Must Be Namespaced

All business APIs must be under one of these namespaces:

```txt
/api/cms/*
/api/client/*
```

Do not add unprefixed routes such as:

```txt
/api/products
/api/orders
/api/categories
```

### RULE-API-002: CMS Controllers Use CMS Names

CMS controller files and classes must be explicit:

```txt
cms-products.controller.ts       -> CmsProductsController
cms-categories.controller.ts     -> CmsCategoriesController
cms-orders.controller.ts         -> CmsOrdersController
cms-auth.controller.ts           -> CmsAuthController
```

Do not add generic audience controllers:

```txt
products.controller.ts
ProductsController
```

### RULE-API-003: Client Controllers Use Client Names

Future client controller files and classes must be explicit:

```txt
client-products.controller.ts    -> ClientProductsController
client-categories.controller.ts  -> ClientCategoriesController
client-auth.controller.ts        -> ClientAuthController
```

Client controllers must live beside CMS controllers inside the same domain module.

### RULE-API-004: Do Not Mix CMS And Client Routes

Do not add a client route in a CMS controller. Do not add a CMS route in a client controller.

Good:

```txt
cms-products.controller.ts       -> @Controller('cms/products')
client-products.controller.ts    -> @Controller('client/products')
```

Bad:

```txt
cms-products.controller.ts       -> @Get('/public-products')
client-products.controller.ts    -> @Get('/admin-products')
```

## DTO And Response Rules

### RULE-DTO-001: Use Audience-Specific DTO Folders

CMS DTOs live under:

```txt
dto/cms/
```

Client DTOs live under:

```txt
dto/client/
```

Do not put request or response DTOs directly under flat `dto/` for audience-specific API contracts.

### RULE-DTO-002: Do Not Share Response DTOs By Default

CMS and client response DTOs should be separate unless the contract is deliberately stable for both audiences and exposes no internal data.

CMS DTOs may include admin workflow fields. Client DTOs must expose only public-safe fields.

### RULE-DTO-003: Controllers Must Not Return TypeORM Entities Directly

Controllers should return explicit response DTOs or lean acknowledgement DTOs. Do not return TypeORM entities as public API responses.

Sensitive or heavy fields must not be returned by default:

```txt
passwordHash
configJson
rawJson
rawDataJson
normalizedDataJson
internal metadata
admin permission data
source/import internals
```

### RULE-RESPONSE-001: GET Returns Data DTOs

GET endpoints should return explicit response DTOs that match the caller's audience.

CMS examples:

```txt
dto/cms/product-response.dto.ts
dto/cms/product-detail-response.dto.ts
```

Future client examples:

```txt
dto/client/client-product-list-response.dto.ts
dto/client/client-product-detail-response.dto.ts
```

### RULE-RESPONSE-002: Mutations Return Lean Acknowledgements

POST, PUT, PATCH, and similar mutation endpoints should not return the full created/updated payload unless the endpoint explicitly requires it.

Preferred:

```json
{ "success": true, "id": "uuid", "message": "Tạo sản phẩm thành công" }
```

or:

```json
{ "success": true, "message": "Cập nhật sản phẩm thành công" }
```

### RULE-RESPONSE-003: DELETE Uses 204 When No Body Is Needed

DELETE endpoints should use `204 No Content` when the caller only needs to know deletion succeeded.

Use an acknowledgement body only when the client contract explicitly requires a message.

### RULE-RESPONSE-004: Error Responses Need Stable Codes

Error responses should include stable machine-readable codes and Vietnamese client-facing messages.

Preferred shape:

```json
{
  "success": false,
  "code": "PRODUCT_NOT_FOUND",
  "message": "Không tìm thấy sản phẩm"
}
```

Avoid vague messages such as:

```txt
Failed
Error
Something went wrong
```

## Language Rules

### RULE-I18N-001: API Messages Are Vietnamese

Messages visible to CMS/client callers should be Vietnamese.

Good:

```txt
Tạo sản phẩm thành công
Không tìm thấy danh mục
Bạn không có quyền thực hiện thao tác này
```

Bad:

```txt
Product created successfully
Category not found
Forbidden
```

### RULE-I18N-002: Error Codes Stay Stable And English-Like

Keep error codes stable and machine-readable:

```txt
PRODUCT_NOT_FOUND
CATEGORY_NOT_FOUND
FORBIDDEN_RESOURCE
VALIDATION_ERROR
```

Do not translate codes into Vietnamese. Translate only user-facing messages.

## Auth And Security Rules

### RULE-AUTH-001: CMS Uses Admin Users And Permissions

CMS endpoints use admin/internal JWTs from `identity.users` and permission decorators such as `@Permissions('product:write')`.

Public CMS endpoints must be intentionally marked with `@Public()`.

### RULE-AUTH-002: Client Must Not Reuse CMS Permissions

Future client endpoints should be public or use external-user auth based on `identity.external_users`.

Do not require CMS permission codes such as `product:write` on storefront/client routes.

### RULE-AUTH-003: Do Not Leak Admin-Only Data To Client APIs

Client APIs must not expose:

```txt
internal status workflows
source/import data
raw snapshots
config JSON
admin permission data
password hashes
```

Add tests when introducing client DTOs to prove these fields are absent.

### RULE-AUTH-004: Validate All Inputs

Use DTO classes with validation decorators for incoming request bodies and queries. Rely on the global `ValidationPipe`; do not manually parse untyped request bodies in controllers.

## Database And TypeORM Rules

### RULE-DB-001: Respect Schema Ownership

This service owns:

```txt
identity.*
marketplace.*
ingestion.*
analytics.*
```

This service must not write to:

```txt
ai.*
```

AI Platform owns the `ai` schema.

### RULE-DB-002: Query For The Audience

CMS queries may include internal fields needed by admin screens.

Client queries should filter to public-safe records, usually active/published data only.

### RULE-DB-003: Avoid N+1 Query Patterns

When returning lists with related data, use appropriate joins, relation loading, or separate batched queries. Do not add per-row database calls inside loops for list endpoints.

### RULE-DB-004: Use Transactions For Multi-Write Operations

Use transactions when an operation writes multiple related records that must succeed or fail together.

## Dependency Injection Rules

### RULE-DI-001: Use Constructor Injection

Prefer constructor injection for services, repositories, config, and helpers.

Do not use service locator patterns or instantiate Nest providers manually with `new` inside controllers/services.

### RULE-DI-002: Register Providers Once

Declare providers in the owning module. Export only what other modules need. Avoid duplicate provider declarations across modules.

## Testing And Verification Rules

### RULE-TEST-001: Add Focused Tests For Contract Changes

When changing response shape, route naming, auth policy, DTO serialization, or error mapping, add or update focused tests.

### RULE-TEST-002: Verify Narrow First, Then Broad

Run the narrowest meaningful test first, then broader checks.

Typical sequence from `commerce-core-service-nestjs/`:

```bash
npm test -- cms-products.controller.spec.ts
npm test
npm run build
```

### RULE-TEST-003: Be Explicit About Unverified Work

If tests/build cannot be run, state exactly what was not verified and why.

### RULE-TEST-004: Remember Lint Can Edit Files

`npm run lint` may run with `--fix`. After lint, inspect `git diff` before reporting completion.

## Documentation And Plan Rules

### RULE-DOCS-001: Keep Plans Separate By Concern

Do not mix unrelated migrations in one implementation step.

Existing concerns are separate:

```txt
docs/2026-08-06-cms-client-naming-cleanup-plan.md
docs/2026-08-06-api-response-contract-cleanup-plan.md
docs/2026-08-06-vietnamese-api-messages-plan.md
```

### RULE-DOCS-002: Update Agent Docs When Patterns Change

If a task changes architecture, route boundaries, response contract, auth rules, or verification commands, update the relevant file under `docs/agent/`.

### RULE-DOCS-003: Do Not Present Docs-Only Work As Runtime Verification

If only documentation was changed, do not claim APIs were tested or runtime behavior was verified.

## Worktree Safety Rules

### RULE-GIT-001: Preserve Existing User Changes

The worktree may contain edits made by the user or another agent. Do not revert or overwrite unrelated changes.

Before edits:

```bash
git status --short
```

Before final response:

```bash
git diff --stat
```

### RULE-GIT-002: Use Focused Diffs

Keep diffs small. If a task starts requiring broad refactors, stop and explain the scope before continuing unless the user explicitly requested a broad migration.

### RULE-GIT-003: Do Not Edit Generated Or Dependency Files

Do not edit:

```txt
dist/
node_modules/
coverage/
generated build artifacts
```

## Quick Review Checklist

Before finishing a code task, confirm:

- Routes stayed under `/api/cms` or `/api/client`.
- Controller file/class names match the API audience.
- DTOs are under `dto/cms` or `dto/client`.
- Controllers do not return TypeORM entities directly.
- Mutation responses are lean unless explicitly required otherwise.
- Error messages are Vietnamese and include stable codes.
- CMS and client auth rules are not mixed.
- Sensitive/internal fields are not exposed.
- Targeted tests and `npm run build` were run, or the verification gap is stated.
