# Service Boundaries

## commerce-admin

React + Vite + Ant Design.

Trách nhiệm:

- UI admin/CMS.
- Login flow và session handling.
- Permission-based menu/action rendering.
- Gọi Core API cho marketplace data.
- Gọi AI API cho AI search, review intelligence và analyst chat.

Không sở hữu business logic và không query database trực tiếp.

## commerce-core-service

Java Spring Boot.

Trách nhiệm:

- Auth và permission.
- Marketplace core data.
- Source registry/import/sync run/raw snapshot metadata.
- Analytics views hoặc API phục vụ reporting.

Core-service sở hữu schema:

```txt
identity    (users, external_users, permissions, user_permissions)
marketplace (sellers, buyers, categories, category_attributes, products,
             product_variants, product_images, reviews, orders, order_items)
ingestion   (data_sources, sync_runs, raw_snapshots, source_products, source_reviews)
analytics
```

Lưu ý về identity:

- `identity.users`: admin/internal users (người vận hành CMS).
- `identity.external_users`: tài khoản bên ngoài (seller/buyer tự đăng ký).
- `sellers.user_id` và `buyers.user_id` là FK nullable tới `external_users`.

## commerce-ai-platform

NestJS.

Trách nhiệm:

- Provider abstraction cho embedding/chat.
- Product/review indexing.
- Vector search bằng pgvector.
- Review intelligence.
- Text-to-SQL analyst.
- AI logs và audit.

AI Platform sở hữu schema:

```txt
ai
```

AI Platform có thể đọc core data bằng read-only DB user, nhưng không update bảng core.

## commerce-platform-infra

Trách nhiệm:

- Docker Compose.
- PostgreSQL + pgvector.
- Redis.
- MinIO.
- Network/env/init scripts.
- Hướng dẫn chạy full system local.

