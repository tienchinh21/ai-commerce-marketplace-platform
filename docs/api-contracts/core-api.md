# Core API Draft

Core API phục vụ Admin CMS và AI Platform.

Core API hiện tại phục vụ Admin CMS. Các route hiện tại dùng prefix `/api/cms`.
Client/storefront API sau này dùng prefix riêng `/api/client` và không dùng chung DTO/response với CMS API.

## Auth

```txt
POST /cms/auth/login
POST /cms/auth/logout
GET /cms/auth/me
GET /cms/auth/me/permissions
```

## Users And Permissions

```txt
GET /cms/users
POST /cms/users
GET /cms/users/:id
PATCH /cms/users/:id
GET /cms/permissions
PUT /cms/users/:id/permissions
```

## Sellers

```txt
GET /cms/sellers
POST /cms/sellers
GET /cms/sellers/:id
PATCH /cms/sellers/:id
```

## Buyers

```txt
GET /cms/buyers
POST /cms/buyers
GET /cms/buyers/:id
PATCH /cms/buyers/:id
```

## Categories

```txt
GET /cms/categories
POST /cms/categories
GET /cms/categories/:id
PATCH /cms/categories/:id
DELETE /cms/categories/:id
```

## Category Attributes

```txt
GET /cms/categories/:categoryId/attributes
POST /cms/categories/:categoryId/attributes
PATCH /cms/category-attributes/:id
DELETE /cms/category-attributes/:id
```

## Products

```txt
GET /cms/products
POST /cms/products
GET /cms/products/:id
PATCH /cms/products/:id
DELETE /cms/products/:id
GET /cms/products/:id/variants
POST /cms/products/:id/variants
GET /cms/products/:id/reviews
```

## Reviews

```txt
GET /cms/reviews
POST /cms/reviews
GET /cms/reviews/:id
PATCH /cms/reviews/:id
```

## Data Sources And Imports

```txt
GET /cms/data-sources
POST /cms/data-sources
GET /cms/data-sources/:id
PATCH /cms/data-sources/:id

POST /cms/imports/products
POST /cms/imports/reviews
GET /cms/sync-runs
GET /cms/sync-runs/:id
GET /cms/raw-snapshots
GET /cms/raw-snapshots/:id
```

## Analytics Views/API

```txt
GET /cms/analytics/product-performance
GET /cms/analytics/review-sentiment
GET /cms/analytics/seller-performance
GET /cms/analytics/category-summary
```

API cụ thể sẽ được làm rõ khi viết implementation plan.

