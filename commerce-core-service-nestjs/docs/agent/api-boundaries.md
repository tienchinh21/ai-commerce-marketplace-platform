# API Boundaries And Naming

## Route Namespaces

All routes are under global prefix `/api`.

Current implemented namespace:

```txt
/api/cms/*
```

Reserved future namespace:

```txt
/api/client/*
```

Do not add unprefixed business routes such as `/api/products`.

## CMS APIs

CMS APIs are for admin/internal users and back-office workflows.

CMS controllers should be named explicitly:

```txt
CmsProductsController
CmsCategoriesController
CmsSellersController
CmsBuyersController
CmsReviewsController
CmsOrdersController
CmsIngestionController
CmsAnalyticsController
CmsAuthController
CmsUsersPermissionsController
```

CMS controller files should use explicit names:

```txt
cms-products.controller.ts
cms-categories.controller.ts
cms-sellers.controller.ts
cms-buyers.controller.ts
cms-reviews.controller.ts
cms-orders.controller.ts
cms-ingestion.controller.ts
cms-analytics.controller.ts
cms-auth.controller.ts
cms-users-permissions.controller.ts
```

CMS routes should keep `/api/cms/*`.

## Client APIs

Client APIs are for storefront or external-user use cases.

Client controllers should be added separately:

```txt
client-products.controller.ts
client-categories.controller.ts
client-auth.controller.ts
client-orders.controller.ts
```

Client routes should use `/api/client/*`.

Client APIs must not expose CMS-only fields such as internal status workflows, source/import data, raw snapshots, config JSON, or admin permission data unless explicitly approved.

## Domain Folder Layout

Use domain folders, then split by audience inside them:

```txt
src/modules/products/
  products.module.ts
  products.service.ts
  product.entity.ts
  product-variant.entity.ts
  product-image.entity.ts
  cms-products.controller.ts
  client-products.controller.ts
  dto/
    cms/
      create-product.dto.ts
      update-product.dto.ts
      product-response.dto.ts
      product-detail-response.dto.ts
    client/
      client-product-list-response.dto.ts
      client-product-detail-response.dto.ts
```

This keeps product persistence and shared product logic together while making API audience obvious.

## Service Method Naming

Shared services can expose audience-specific query methods when data shape or rules differ:

```ts
listCmsProducts(query: ListCmsProductsQuery)
getCmsProductDetail(id: string)
listClientProducts(query: ListClientProductsQuery)
getClientProductBySlug(slug: string)
```

Avoid reusing a CMS method for client routes if it returns fields the client should not inspect.

## DTO Rules

CMS DTOs and client DTOs should not share response classes by default.

Use CMS DTOs for admin screens:

```txt
dto/cms/product-response.dto.ts
dto/cms/product-detail-response.dto.ts
```

Use client DTOs for public/storefront screens:

```txt
dto/client/client-product-list-response.dto.ts
dto/client/client-product-detail-response.dto.ts
```

Use serialization helpers to strip non-exposed fields.

