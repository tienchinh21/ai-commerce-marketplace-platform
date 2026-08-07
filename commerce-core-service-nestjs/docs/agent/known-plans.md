# Known Plans And Current State

This file lists local plans and their current status. Current source code and `docs/agent/rules.md` are the source of truth. Older plans are historical records unless this file marks them as open.

## Plan Status

| Plan | Status | How to use now |
| --- | --- | --- |
| `docs/superpowers/plans/2026-08-05-cms-route-segmentation.md` | Completed / historical | Do not execute as-is. Routes are already under `/api/cms/*`. |
| `docs/2026-08-06-cms-client-naming-cleanup-plan.md` | Completed / historical | Do not execute as-is. CMS controllers/specs and `dto/cms/` already exist. |
| `docs/2026-08-06-api-response-contract-cleanup-plan.md` | Implemented baseline / historical | Use only for rationale. Current filenames are `cms-*` and DTOs are under `dto/cms/`. |
| `docs/2026-08-06-vietnamese-api-messages-plan.md` | Implemented baseline / historical | Use only for rationale. Current source uses `VI_API_MESSAGES`, `ApiErrorCode`, and `ApiExceptionFilter`. |

## Current State

- Routes are already segmented under `/api/cms/*`.
- The service is still domain-folder based, for example `src/modules/products/`.
- CMS controller class/file names are explicit, for example `cms-products.controller.ts` / `CmsProductsController`.
- CMS DTOs live under `dto/cms/` in every implemented domain module.
- Architecture naming is guarded by `src/architecture-naming.spec.ts`.
- Lean mutation responses are implemented through `src/shared/api/mutation-response.dto.ts`.
- Vietnamese success/error messages are centralized in `src/shared/api/api-messages.vi.ts`.
- Stable error codes and normalized exception responses are implemented in `src/shared/api/api-error-code.ts` and `src/shared/api/api-exception.filter.ts`.
- Future `/api/client/*` routes and client auth are not implemented yet.

## Historical CMS Naming Baseline

The following migration has already been applied. Keep CMS controllers and specs explicit without changing routes:

```txt
auth.controller.ts                  -> cms-auth.controller.ts
AuthController                      -> CmsAuthController

users-permissions.controller.ts     -> cms-users-permissions.controller.ts
UsersPermissionsController          -> CmsUsersPermissionsController

categories.controller.ts            -> cms-categories.controller.ts
CategoriesController                -> CmsCategoriesController

sellers.controller.ts               -> cms-sellers.controller.ts
SellersController                   -> CmsSellersController

buyers.controller.ts                -> cms-buyers.controller.ts
BuyersController                    -> CmsBuyersController

products.controller.ts              -> cms-products.controller.ts
ProductsController                  -> CmsProductsController

reviews.controller.ts               -> cms-reviews.controller.ts
ReviewsController                   -> CmsReviewsController

orders.controller.ts                -> cms-orders.controller.ts
OrdersController                    -> CmsOrdersController

ingestion.controller.ts             -> cms-ingestion.controller.ts
IngestionController                 -> CmsIngestionController

analytics.controller.ts             -> cms-analytics.controller.ts
AnalyticsController                 -> CmsAnalyticsController
```

Current modules already import the `Cms*Controller` classes and matching `cms-*.controller.spec.ts` files.

## DTO Folder Baseline

CMS DTOs already live under `dto/cms/`, and `dto/client/` is reserved for future client contracts:

```txt
dto/create-product.dto.ts                 -> dto/cms/create-product.dto.ts
dto/update-product.dto.ts                 -> dto/cms/update-product.dto.ts
dto/product-response.dto.ts               -> dto/cms/product-response.dto.ts
dto/product-detail-response.dto.ts        -> dto/cms/product-detail-response.dto.ts
dto/client/client-product-list-response.dto.ts
dto/client/client-product-detail-response.dto.ts
```

Do not move shared domain modules into CMS-specific folders. Add future `client-*` controllers and `dto/client/*` files beside the existing CMS files.

## Client API Readiness Checklist

Before adding `/api/client/*`:

- CMS controller names are explicit.
- CMS DTO folders are separate from future client DTO folders.
- Public routes are intentionally marked with `@Public()`.
- External-user auth plan exists for logged-in client routes.
- Client response DTOs expose only public-safe fields.
- Tests prove CMS-only fields are not returned by client endpoints.
