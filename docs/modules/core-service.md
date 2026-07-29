# Core Service

Core-service dùng Java Spring Boot và là service sở hữu dữ liệu marketplace chính.

## Trách Nhiệm

- Auth.
- Permission-based authorization.
- Seller management.
- Buyer/customer management.
- Category và category attributes.
- Product catalog.
- Product variants/images.
- Reviews.
- Orders cơ bản cho analytics.
- Data source registry.
- Import/sync run.
- Raw snapshot metadata.
- Analytics views/API.

## Domain Tables

```txt
users
permissions
user_permissions

sellers
buyers

categories
category_attributes

products
product_variants
product_images

reviews

orders
order_items

data_sources
sync_runs
raw_snapshots
source_products
source_reviews
```

## Product Specs

Product dùng hybrid specs:

```txt
products.specs_json
product_variants.specs_json
category_attributes
```

`specs_json` giúp import/crawl dữ liệu linh hoạt. `category_attributes` giúp filter/index/validation cho các field quan trọng.

## Boundary Với AI

Core-service không làm logic AI.

AI Platform có thể:

- gọi Core API;
- đọc database bằng read-only user cho batch jobs;
- không update trực tiếp bảng core.

