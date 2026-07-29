# Thiết Kế Phase 1 - AI Commerce Marketplace Platform

Ngày: 2026-07-29

## 1. Mục Tiêu

Dự án là một marketplace platform theo hướng admin-first, dùng để ôn lại kiến thức code, hệ thống và học sâu các thành phần AI hiện đại.

Phase 1 không tập trung làm storefront hoàn chỉnh cho buyer hoặc seller portal riêng. Trọng tâm là xây nền marketplace core, admin CMS, dữ liệu product/review/import/source đủ thật, rồi xây AI Platform trên dữ liệu đó.

Hệ thống cần hỗ trợ:

- Admin quản trị seller, buyer/customer, category, product, review và source/import.
- Dữ liệu marketplace tổng hợp với nhiều category.
- Source registry để sau này sync/crawl từ web lớn, API, feed hoặc dataset.
- AI Platform cho semantic product search, review intelligence và text-to-SQL analyst.
- Docker full system để chạy local như một hệ thống thật.

## 2. Scope Phase 1

Phase 1 chọn hướng Approach B: Admin và AI phát triển song song.

Milestone:

```txt
M1: Foundation + Catalog Admin
M2: Review + Data Source/Import + realistic dataset
M3: Semantic Product Search
M4: Review Intelligence
M5: Text-to-SQL Analyst
```

Phase 1 có model seller và buyer/customer trong database, nhưng chưa làm seller portal hoặc buyer web client riêng. Các phần đó để phase sau.

Không làm trong phase 1:

- Payment thật.
- Shipping thật.
- Cart/wishlist hoàn chỉnh.
- Multi-seller operation đầy đủ như sàn lớn.
- Crawler production phức tạp.
- LangChain/LangGraph orchestration.

## 3. Repo Boundary

Phase 1 dùng 4 repo clone ngang hàng:

```txt
Ecommerc/
  commerce-admin/
  commerce-core-service/
  commerce-ai-platform/
  commerce-platform-infra/
```

### commerce-admin

- React + Vite + Ant Design.
- Là CMS/admin internal.
- Không sở hữu business logic.
- Gọi core-service cho marketplace data.
- Gọi AI Platform cho semantic search, review intelligence và analyst chat.
- Ưu tiên data-operation workflow trước: table, filter, form, import, sync status.

### commerce-core-service

- Java Spring Boot.
- Sở hữu marketplace schema, ingestion schema và identity/permission.
- Là backend chính cho admin CMS.
- Không cần chốt sâu build tool hoặc Java implementation trong spec này; chỉ cần rõ module, API và database ownership.

### commerce-ai-platform

- NestJS.
- Sở hữu AI schema.
- Đọc core data bằng hybrid mode:
  - gọi core API cho contract nghiệp vụ;
  - dùng PostgreSQL read-only user cho batch indexing, vector query và text-to-SQL.
- Chỉ ghi vào schema AI.
- Dùng provider abstraction cho embedding/chat.
- Vector store mặc định là PostgreSQL + pgvector.

### commerce-platform-infra

- Chứa Docker Compose chạy full system.
- Chứa env mẫu, network, init scripts, docs vận hành.
- Chạy PostgreSQL + pgvector, Redis, MinIO, core-service, ai-platform và admin.

## 4. Category Scope

Phase 1 dùng marketplace tổng hợp với 5 category đầu:

```txt
electronics
fashion
beauty
home-living
sports-outdoor
```

Mục tiêu là có dữ liệu đa dạng để test schema động, review analysis, semantic search và text-to-SQL, nhưng chưa mở rộng đến mọi category của một marketplace lớn.

## 5. Domain Model

Database chia theo schema logic:

```txt
identity
marketplace
ingestion
ai
analytics
```

### Identity/Auth

Core-service sở hữu:

```txt
users
permissions
user_permissions
sessions hoặc token metadata nếu cần
```

Auth dùng permission-based model theo resource/action. Ví dụ:

```txt
product:read
product:write
review:read
review:moderate
seller:read
seller:write
buyer:read
source:read
source:write
source:sync
ai:search
ai:review:analyze
ai:analyst:chat
```

Admin FE render menu/action dựa trên permission của current user.

### Marketplace Core

Core-service sở hữu:

```txt
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
```

Product dùng hybrid specs:

```txt
products.specs_json
product_variants.specs_json
category_attributes
```

Ý nghĩa:

- `specs_json` giữ thuộc tính linh hoạt theo category và source.
- `category_attributes` định nghĩa các field quan trọng để filter, index và validate nhẹ.

Order ở phase 1 là order cơ bản phục vụ analytics/text-to-SQL. Chưa có payment/shipping thật. Status có thể gồm:

```txt
PENDING
PAID
CANCELLED
REFUNDED
COMPLETED
```

### Source/Import Foundation

Core-service sở hữu:

```txt
data_sources
sync_runs
raw_snapshots
source_products
source_reviews
```

Mục tiêu:

- Phase đầu hỗ trợ admin import CSV/JSON và realistic seeder.
- Sau này crawler/API/feed sẽ dùng cùng source registry.
- `source_products` và `source_reviews` lưu record theo nguồn.
- `products` và `reviews` là canonical data dùng cho admin và AI.
- Nhiều `source_products` sau này có thể map vào một canonical product.

Raw storage dùng hybrid:

- Raw JSON nhỏ lưu trong PostgreSQL dạng JSONB.
- Raw HTML/file lớn lưu trong MinIO/object storage.
- DB luôn lưu metadata, hash, object key/url, parse status và source reference.

### AI Platform Schema

AI Platform sở hữu:

```txt
product_embeddings
review_embeddings
review_ai_analysis
product_ai_summaries
ai_chat_sessions
ai_chat_messages
ai_query_logs
```

AI service không update trực tiếp bảng core.

## 6. AI Platform Design

AI Platform dùng NestJS và tự viết orchestration nhẹ trong phase 1.

Module chính:

```txt
providers
vector-store
indexing
semantic-search
review-intelligence
analyst-chat
sql-safety
ai-logs
```

### Provider Abstraction

Tạo interface:

```txt
EmbeddingProvider
ChatProvider
```

Ban đầu có thể dùng OpenAI hoặc local/Ollama. Service code không phụ thuộc trực tiếp một vendor.

### Vector Store

Vector store mặc định:

```txt
PostgreSQL + pgvector
```

AI Platform lưu vector vào:

```txt
product_embeddings
review_embeddings
```

Embedding input cho product gồm:

```txt
title
brand
category path
description
specs_json normalized text
seller/source hints nếu cần
```

### Product Indexing Flow

```txt
core products
   |
   | read-only DB hoặc core API
   v
normalize product text
   |
   v
embedding provider
   |
   v
product_embeddings trong pgvector
```

Indexing job cần:

- index product mới;
- re-index product khi title, description, category hoặc specs đổi;
- lưu embedding model/version;
- idempotent để chạy lại không tạo duplicate vector.

### Review Indexing Flow

```txt
core reviews
   |
   | read-only DB hoặc core API
   v
normalize review text
   |
   v
embedding provider
   |
   v
review_embeddings trong pgvector
```

Review embeddings phục vụ phase sau cho RAG Q&A trên review.

### Semantic Product Search Flow

```txt
Admin nhập natural language query + filters
   |
   v
CMS gọi AI Platform
   |
   v
AI parse filters: category, price, brand, rating nếu có
   |
   v
AI tạo query embedding
   |
   v
AI query pgvector + structured filters
   |
   v
AI lấy top products
   |
   v
ChatProvider tạo explanation
   |
   v
CMS hiển thị product results + score + explanation
```

Kết quả trả về:

- product id;
- title;
- category;
- seller nếu có;
- similarity score;
- matched fields;
- explanation;
- filter metadata.

### Review Intelligence Flow

```txt
reviews
   |
   v
AI classify sentiment/topics
   |
   v
review_ai_analysis
   |
   v
aggregate by product/category
   |
   v
product_ai_summaries
   |
   v
CMS hiển thị review intelligence
```

Phase 1 gồm:

- sentiment analysis;
- topic extraction;
- complaint/praise labels;
- product review summary.

Product summary lưu:

- strengths;
- weaknesses;
- common complaints;
- common praises;
- recommended buyer profile;
- confidence;
- source review count.

RAG Q&A trên review để phase sau.

### Text-to-SQL Analyst Flow

```txt
Admin nhập câu hỏi
   |
   v
CMS gọi AI Platform analyst-chat
   |
   v
AI chọn schema/view whitelist
   |
   v
LLM sinh SQL
   |
   v
SQL safety validator kiểm tra
   |
   v
AI execute bằng read-only DB user
   |
   v
AI nhận result table
   |
   v
LLM tạo câu trả lời cuối + chart suggestion
   |
   v
CMS hiển thị answer + SQL + table + chart
```

Guardrail bắt buộc:

- chỉ cho phép `SELECT`;
- ưu tiên analytics views;
- whitelist một số bảng/cột core khi cần drill-down;
- block `INSERT`, `UPDATE`, `DELETE`, `DROP`, `ALTER`, `TRUNCATE`;
- default `LIMIT`;
- query timeout;
- read-only DB user;
- audit log vào `ai_query_logs`;
- hiển thị SQL cho admin để học/debug.

### Framework Extension Point

Phase 1 không dùng LangChain hoặc LangGraph. Nhưng các module `analyst-chat` và `review-intelligence` phải tách orchestration thành service riêng để sau này có thể đổi sang LangGraph nếu workflow agent nhiều bước hơn.

## 7. Admin CMS Design

Admin dùng:

```txt
React + Vite + Ant Design
```

Admin không có backend nghiệp vụ riêng. Nếu cần server layer thì chỉ là BFF rất mỏng, không sở hữu business data.

### Layout

```txt
Login
Main Layout
  Sidebar
  Header user/session
  Permission-based menu
  Content area
```

### Screens Phase 1

```txt
Dashboard
Sellers
Buyers
Categories
Category Attributes
Products
Product Detail
Reviews
Data Sources
Imports / Sync Runs
Raw Snapshots
AI Search
Review Intelligence
AI Analyst Chat
Users & Permissions
```

### Product Catalog Workflow

```txt
Admin tạo/sửa category
   |
   v
Admin định nghĩa category attributes
   |
   v
Admin tạo/sửa seller
   |
   v
Admin tạo/sửa product, variants, images, specs_json
   |
   v
Core-service lưu canonical product
   |
   v
AI indexing job detect product mới/đổi
   |
   v
Product xuất hiện trong semantic search
```

### Review Workflow

```txt
Admin import/tạo reviews
   |
   v
Core-service lưu review gốc
   |
   v
AI review analysis job chạy sentiment/topics
   |
   v
AI lưu review_ai_analysis
   |
   v
AI aggregate product summary
   |
   v
Admin xem review intelligence trong CMS
```

### Import/Source Workflow

```txt
Admin tạo data source
   |
   v
Admin import CSV/JSON hoặc chạy sync giả lập
   |
   v
Core tạo sync_run
   |
   v
Core lưu raw_snapshot/source_products/source_reviews
   |
   v
Core map thành product/review canonical
   |
   v
AI indexing/review jobs chạy trên canonical data
```

### FE Implementation Priority

```txt
1. Login/layout/permission menu
2. Category/category attributes
3. Seller/product/product detail
4. Review
5. Data source/import/sync run/raw snapshot
6. AI Search
7. Review Intelligence
8. AI Analyst Chat
9. Dashboard polish
```

## 8. Infra Design

Infra phase 1 gồm:

```txt
PostgreSQL + pgvector
Redis
MinIO
commerce-core-service
commerce-ai-platform
commerce-admin
```

Service communication:

```txt
CMS -> Core API
CMS -> AI API
AI -> Core API
AI -> PostgreSQL read-only
AI -> PostgreSQL ai schema write
```

Redis dùng cho:

- AI indexing jobs;
- review analysis jobs;
- optional cache.

MinIO dùng cho:

- raw HTML/file snapshot;
- product images nếu phase đầu chưa dùng cloud storage.

## 9. API Contract Draft

Core API cần có contract cho:

- auth/session/current user;
- permissions;
- sellers;
- buyers;
- categories;
- category attributes;
- products;
- reviews;
- data sources;
- imports/sync runs;
- raw snapshots.

AI API cần có contract cho:

- run/rebuild product index;
- semantic search;
- run review analysis;
- get product review summary;
- analyst chat;
- query logs.

Chi tiết API tách trong `docs/api-contracts`.

## 10. Tài Liệu Chuyên Đề

Spec này là tài liệu tổng hợp quyết định thiết kế. Các phần chi tiết hơn được tách ra để dễ đọc và dễ update theo module:

```txt
docs/architecture/overview.md
docs/architecture/phase-roadmap.md
docs/architecture/service-boundaries.md
docs/architecture/data-flow.md
docs/modules/admin-cms.md
docs/modules/core-service.md
docs/modules/database-model.md
docs/modules/ai-platform.md
docs/modules/ingestion.md
docs/modules/permissions.md
docs/modules/realistic-dataset.md
docs/modules/text-to-sql-safety.md
docs/api-contracts/core-api.md
docs/api-contracts/ai-api.md
docs/infra/local-docker.md
```

Những file này phải được xem là docs phase 1, không phải tài liệu rời rạc. Khi đổi quyết định thiết kế lớn, cần update cả spec chính và file chuyên đề liên quan.

## 11. Testing Và Verification

Core-service:

- API integration test cho auth/permission;
- product/category/review/import basic flows;
- migration chạy sạch.

AI Platform:

- unit test cho provider abstraction;
- SQL safety validator test;
- semantic search service test với fixture nhỏ;
- review analysis parser/validator test;
- indexing job idempotency test.

Admin:

- page smoke test;
- API client error handling;
- permission menu rendering;
- critical form validation.

Infra:

- Docker full system chạy được;
- healthcheck cho Postgres, Redis, MinIO, core, AI, admin.

## 12. Done Criteria Phase 1

Phase 1 đạt khi:

```txt
1. Admin login được bằng permission-based auth.
2. Admin quản lý được category, attributes, sellers, products, reviews.
3. Admin tạo/import được realistic product + review dataset.
4. Source registry/sync run/raw snapshot metadata hoạt động.
5. AI Platform index được products vào pgvector.
6. Semantic search trả kết quả có filter + score + explanation.
7. Review intelligence phân tích sentiment/topics và tạo product summary.
8. AI Analyst text-to-SQL chạy SELECT an toàn trên analytics views/whitelisted tables.
9. Docker full system chạy được từ infra repo.
10. Docs mô tả đầy đủ architecture, data flow, module boundary.
```

## 13. Phase Sau

Phase sau có thể mở rộng:

- Seller portal.
- Buyer web client bằng Next.js.
- Cart/wishlist/checkout cơ bản.
- Payment/shipping integration.
- Crawler adapters cho các nguồn cụ thể.
- Product matching/deduplication nâng cao.
- RAG Q&A trên review.
- LangGraph hoặc workflow agent framework nếu analyst chat phức tạp hơn.
