# CMS Client Naming Cleanup Implementation Plan

> **Status:** Completed / historical. The current source already uses `cms-*.controller.ts`, `Cms*Controller`, matching `cms-*.controller.spec.ts`, and `dto/cms/` folders. Do not execute this plan as-is; use it only for rationale and use current source paths when making new changes.

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to execute this plan step-by-step.

## Goal

Make the NestJS Core service naming explicit for CMS APIs while keeping domain modules reusable for future Client APIs.

At the time this plan was written, route behavior was already CMS-first, for example `/api/cms/products`, but many source files/classes still used generic names such as `ProductsController`, `products.controller.ts`, and flat `dto` folders. The current source has already completed this migration.

The target structure is:

- Domain modules stay domain-named: `products`, `categories`, `orders`, `reviews`, `sellers`, `buyers`, `auth`, `users-permissions`, `ingestion`, `analytics`.
- CMS-facing controllers/classes/specs are explicitly named with `Cms`.
- CMS-facing DTOs are grouped under `dto/cms/`.
- Future Client APIs can be added beside CMS APIs as `client-*.controller.ts` and `dto/client/` without renaming the domain module again.

## Architecture Decision

Do not rename `src/modules/products/` to `src/modules/cms-products/`.

`products` is the domain module. CMS and Client are audiences/channels inside that domain. The clean long-term model is:

```text
src/modules/products/
  products.module.ts
  products.service.ts
  product.entity.ts
  product-variant.entity.ts
  product-image.entity.ts
  cms-products.controller.ts
  cms-products.controller.spec.ts
  dto/
    cms/
      create-product.dto.ts
      update-product.dto.ts
      add-images.dto.ts
      create-variant.dto.ts
      product-response.dto.ts
      product-detail-response.dto.ts
      product-image-response.dto.ts
      product-variant-response.dto.ts
    client/
      README.md
```

When Client APIs are introduced later:

```text
src/modules/products/
  client-products.controller.ts
  client-products.controller.spec.ts
  dto/
    client/
      product-list-item.dto.ts
      product-detail.dto.ts
      product-search-query.dto.ts
```

This keeps shared business logic in `products.service.ts`, while each API audience owns its own request/response shape.

## Historical Rename Map

| Domain | Current file/class | Target file/class |
| --- | --- | --- |
| Auth | `auth.controller.ts` / `AuthController` | `cms-auth.controller.ts` / `CmsAuthController` |
| Users Permissions | `users-permissions.controller.ts` / `UsersPermissionsController` | `cms-users-permissions.controller.ts` / `CmsUsersPermissionsController` |
| Categories | `categories.controller.ts` / `CategoriesController` | `cms-categories.controller.ts` / `CmsCategoriesController` |
| Sellers | `sellers.controller.ts` / `SellersController` | `cms-sellers.controller.ts` / `CmsSellersController` |
| Buyers | `buyers.controller.ts` / `BuyersController` | `cms-buyers.controller.ts` / `CmsBuyersController` |
| Products | `products.controller.ts` / `ProductsController` | `cms-products.controller.ts` / `CmsProductsController` |
| Reviews | `reviews.controller.ts` / `ReviewsController` | `cms-reviews.controller.ts` / `CmsReviewsController` |
| Orders | `orders.controller.ts` / `OrdersController` | `cms-orders.controller.ts` / `CmsOrdersController` |
| Ingestion | `ingestion.controller.ts` / `IngestionController` | `cms-ingestion.controller.ts` / `CmsIngestionController` |
| Analytics | `analytics.controller.ts` / `AnalyticsController` | `cms-analytics.controller.ts` / `CmsAnalyticsController` |

## Constraints

- Keep runtime routes unchanged: all current endpoints must remain under the `/api/cms` prefix.
- Do not change service behavior in this cleanup.
- Do not return created/updated payloads again as part of this naming cleanup. Response contract work belongs to `2026-08-06-api-response-contract-cleanup-plan.md`.
- Do not translate API messages in this cleanup. Vietnamese message work belongs to `2026-08-06-vietnamese-api-messages-plan.md`.
- Keep module folder names domain-based.
- Avoid new global abstractions unless needed for compile correctness.
- Preserve existing permissions, guards, decorators, Swagger tags, and route handlers.

## Task 1: Rename CMS Controllers

Use `git mv` so history is preserved.

Commands:

```bash
cd commerce-core-service-nestjs

git mv src/modules/auth/auth.controller.ts src/modules/auth/cms-auth.controller.ts
git mv src/modules/users-permissions/users-permissions.controller.ts src/modules/users-permissions/cms-users-permissions.controller.ts
git mv src/modules/categories/categories.controller.ts src/modules/categories/cms-categories.controller.ts
git mv src/modules/sellers/sellers.controller.ts src/modules/sellers/cms-sellers.controller.ts
git mv src/modules/buyers/buyers.controller.ts src/modules/buyers/cms-buyers.controller.ts
git mv src/modules/products/products.controller.ts src/modules/products/cms-products.controller.ts
git mv src/modules/reviews/reviews.controller.ts src/modules/reviews/cms-reviews.controller.ts
git mv src/modules/orders/orders.controller.ts src/modules/orders/cms-orders.controller.ts
git mv src/modules/ingestion/ingestion.controller.ts src/modules/ingestion/cms-ingestion.controller.ts
git mv src/modules/analytics/analytics.controller.ts src/modules/analytics/cms-analytics.controller.ts
```

Then rename classes:

```text
AuthController -> CmsAuthController
UsersPermissionsController -> CmsUsersPermissionsController
CategoriesController -> CmsCategoriesController
SellersController -> CmsSellersController
BuyersController -> CmsBuyersController
ProductsController -> CmsProductsController
ReviewsController -> CmsReviewsController
OrdersController -> CmsOrdersController
IngestionController -> CmsIngestionController
AnalyticsController -> CmsAnalyticsController
```

Acceptance checks:

- Every current controller file name starts with `cms-`.
- Every current controller class name starts with `Cms`.
- CMS route prefixes in `@Controller()` decorators are unchanged.

## Task 2: Update Module Registrations and Imports

Update each `*.module.ts` import and `controllers` array.

Examples:

```ts
import { CmsProductsController } from './cms-products.controller';

@Module({
  controllers: [CmsProductsController],
})
export class ProductsModule {}
```

Apply the same pattern for:

- `src/modules/auth/auth.module.ts`
- `src/modules/users-permissions/users-permissions.module.ts`
- `src/modules/categories/categories.module.ts`
- `src/modules/sellers/sellers.module.ts`
- `src/modules/buyers/buyers.module.ts`
- `src/modules/products/products.module.ts`
- `src/modules/reviews/reviews.module.ts`
- `src/modules/orders/orders.module.ts`
- `src/modules/ingestion/ingestion.module.ts`
- `src/modules/analytics/analytics.module.ts`

Acceptance checks:

- No module imports `./products.controller`, `./categories.controller`, or any other old generic controller filename.
- No NestJS module controller array references a generic controller class.

## Task 3: Rename Controller Specs

Use `git mv` for current controller specs.

Commands:

```bash
cd commerce-core-service-nestjs

git mv src/modules/users-permissions/users-permissions.controller.spec.ts src/modules/users-permissions/cms-users-permissions.controller.spec.ts
git mv src/modules/categories/categories.controller.spec.ts src/modules/categories/cms-categories.controller.spec.ts
git mv src/modules/sellers/sellers.controller.spec.ts src/modules/sellers/cms-sellers.controller.spec.ts
git mv src/modules/buyers/buyers.controller.spec.ts src/modules/buyers/cms-buyers.controller.spec.ts
git mv src/modules/products/products.controller.spec.ts src/modules/products/cms-products.controller.spec.ts
git mv src/modules/reviews/reviews.controller.spec.ts src/modules/reviews/cms-reviews.controller.spec.ts
git mv src/modules/orders/orders.controller.spec.ts src/modules/orders/cms-orders.controller.spec.ts
git mv src/modules/ingestion/ingestion.controller.spec.ts src/modules/ingestion/cms-ingestion.controller.spec.ts
```

Update each spec import/class reference to the renamed CMS controller.

Acceptance checks:

- Controller spec filenames match the controller filenames they test.
- Test descriptions can remain readable, but should mention CMS when helpful.

## Task 4: Move CMS DTOs Under `dto/cms`

Move request/response DTOs that are used by CMS controllers from flat `dto/` into `dto/cms/`.

Recommended command shape:

```bash
cd commerce-core-service-nestjs

mkdir -p src/modules/products/dto/cms src/modules/products/dto/client
git mv src/modules/products/dto/create-product.dto.ts src/modules/products/dto/cms/create-product.dto.ts
git mv src/modules/products/dto/update-product.dto.ts src/modules/products/dto/cms/update-product.dto.ts
git mv src/modules/products/dto/add-images.dto.ts src/modules/products/dto/cms/add-images.dto.ts
git mv src/modules/products/dto/create-variant.dto.ts src/modules/products/dto/cms/create-variant.dto.ts
git mv src/modules/products/dto/product-response.dto.ts src/modules/products/dto/cms/product-response.dto.ts
git mv src/modules/products/dto/product-detail-response.dto.ts src/modules/products/dto/cms/product-detail-response.dto.ts
git mv src/modules/products/dto/product-image-response.dto.ts src/modules/products/dto/cms/product-image-response.dto.ts
git mv src/modules/products/dto/product-variant-response.dto.ts src/modules/products/dto/cms/product-variant-response.dto.ts
```

Repeat the same pattern for:

- `auth/dto/*`
- `users-permissions/dto/*`
- `categories/dto/*`
- `sellers/dto/*`
- `buyers/dto/*`
- `reviews/dto/*`
- `orders/dto/*`
- `ingestion/dto/*`
- `analytics/dto/*`

Only create `dto/client/README.md` where there is a concrete reason to reserve the folder. Do not add many empty folders because Git will not track them cleanly without placeholder files.

Acceptance checks:

- CMS controllers import DTOs from files below their local `dto/cms` folder.
- Services should not depend on CMS response DTOs unless already part of the current design. Prefer mapping response DTOs at controller boundary when later refactoring behavior.
- Domain entities stay at module root.

## Task 5: Keep API Audience Boundaries Explicit

Add or update agent docs so future agents follow this rule:

- `cms-*.controller.ts` is for internal admin/CMS routes.
- `client-*.controller.ts` is for public buyer/seller/client routes.
- Shared services remain domain services.
- DTOs are audience-specific unless explicitly shared and stable.

Files to update:

- `AGENTS.md`
- `docs/agent/api-boundaries.md`
- `docs/agent/architecture.md`
- `docs/agent/known-plans.md`

Acceptance checks:

- A new AI agent reading `commerce-core-service-nestjs/AGENTS.md` understands that `products` is a domain folder, not CMS-only.
- Docs mention how to add future Client API without moving the current CMS code again.

## Task 6: Add Naming Guard Test or Verification Script

Add a lightweight guard so future edits do not reintroduce generic controller names.

Preferred option: add a Jest spec under `src/architecture-naming.spec.ts` that scans `src/modules` and asserts:

- Any controller with a route starting `cms` must have filename prefix `cms-`.
- Any controller with a route starting `cms` must export class prefix `Cms`.
- Future client controllers must use filename prefix `client-` and class prefix `Client`.

If a test is too much for the first cleanup, add the same checks as documented verification commands in this plan and `docs/agent/workflows.md`.

Acceptance checks:

- The guard passes after the rename.
- A generic `products.controller.ts` with `@Controller('cms/products')` would fail the guard.

## Task 7: Verification

Run these from `commerce-core-service-nestjs`.

```bash
npm test
npm run build
```

Run targeted static checks:

```bash
rg -n "export class (AuthController|UsersPermissionsController|CategoriesController|SellersController|BuyersController|ProductsController|ReviewsController|OrdersController|IngestionController|AnalyticsController)" src/modules
rg -n "from './(auth|users-permissions|categories|sellers|buyers|products|reviews|orders|ingestion|analytics)\\.controller'" src/modules
rg -n "@Controller\\('" src/modules
```

Expected results:

- First command returns no generic CMS controller class names.
- Second command returns no old generic controller imports.
- Third command shows only `cms` route prefixes for current API controllers. Future `client` route prefixes are allowed after Client API is implemented.

## Rollback Plan

If build or tests fail because of import path mistakes:

1. Use `git diff --name-status` to inspect renamed files.
2. Fix imports by module, one domain at a time.
3. Re-run the targeted spec for the affected domain.
4. Re-run `npm test` and `npm run build`.

Avoid reverting unrelated files. If a domain has unrelated in-progress changes, update imports around those changes instead of resetting the file.

## Final State

After this cleanup, the current CMS API remains functionally unchanged, but the source tree makes ownership clear:

- Route audience is visible in route path: `/api/cms`.
- Source ownership is visible in file/class names: `cms-products.controller.ts`, `CmsProductsController`.
- DTO ownership is visible in folder names: `dto/cms`.
- Future Client API can be added as sibling files: `client-products.controller.ts`, `dto/client`.
