# Core API Draft

Core API phục vụ Admin CMS và AI Platform.

## Auth

```txt
POST /auth/login
POST /auth/logout
GET /auth/me
GET /auth/me/permissions
```

## Users And Permissions

```txt
GET /users
POST /users
GET /users/:id
PATCH /users/:id
GET /permissions
PUT /users/:id/permissions
```

## Sellers

```txt
GET /sellers
POST /sellers
GET /sellers/:id
PATCH /sellers/:id
```

## Buyers

```txt
GET /buyers
POST /buyers
GET /buyers/:id
PATCH /buyers/:id
```

## Categories

```txt
GET /categories
POST /categories
GET /categories/:id
PATCH /categories/:id
DELETE /categories/:id
```

## Category Attributes

```txt
GET /categories/:categoryId/attributes
POST /categories/:categoryId/attributes
PATCH /category-attributes/:id
DELETE /category-attributes/:id
```

## Products

```txt
GET /products
POST /products
GET /products/:id
PATCH /products/:id
DELETE /products/:id
GET /products/:id/variants
POST /products/:id/variants
GET /products/:id/reviews
```

## Reviews

```txt
GET /reviews
POST /reviews
GET /reviews/:id
PATCH /reviews/:id
```

## Data Sources And Imports

```txt
GET /data-sources
POST /data-sources
GET /data-sources/:id
PATCH /data-sources/:id

POST /imports/products
POST /imports/reviews
GET /sync-runs
GET /sync-runs/:id
GET /raw-snapshots
GET /raw-snapshots/:id
```

## Analytics Views/API

```txt
GET /analytics/product-performance
GET /analytics/review-sentiment
GET /analytics/seller-performance
GET /analytics/category-summary
```

API cụ thể sẽ được làm rõ khi viết implementation plan.

