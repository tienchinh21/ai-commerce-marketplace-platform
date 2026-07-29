# Core-Service Implementation Brief

Mục tiêu của `commerce-core-service` là cung cấp backend marketplace core cho Admin CMS và AI Platform.

Tài liệu này chỉ mô tả service cần làm gì, cần expose contract nào và sở hữu dữ liệu nào. Không hướng dẫn chi tiết cách code Java, cách chia package, controller, service, repository hay build tool. Phần implementation cụ thể do backend Java owner quyết định.

## 1. Vai Trò Trong Hệ Thống

`commerce-core-service` là source of truth cho dữ liệu marketplace.

Service này phục vụ:

- `commerce-admin`: quản trị dữ liệu marketplace.
- `commerce-ai-platform`: đọc dữ liệu core để index, phân tích review và chạy AI analyst.

Core-service không làm logic AI. AI Platform chỉ đọc dữ liệu core qua Core API hoặc PostgreSQL read-only user, và chỉ ghi vào schema AI.

## 2. Required Modules

### Auth And Permissions

Core-service cần cung cấp:

- Login/logout.
- Current user endpoint.
- Permission list của current user.
- Permission-based authorization theo resource/action.

Phân biệt hai loại users:

- `identity.users`: admin/internal users (người vận hành CMS). Có permission system, roles, departments.
- `identity.external_users`: tài khoản người dùng bên ngoài. Seller/buyer tự đăng ký qua seller portal hoặc buyer app ở phase sau. Phase 1 bảng này tồn tại sẵn nhưng admin import data thì `user_id` trong sellers/buyers để NULL.

Tách `external_users` riêng khỏi `users` vì:

- Admin users có permission system, roles, departments phức tạp, external users thì không.
- Tránh phải JOIN lọc role mỗi lần query admin users khi số lượng external users lớn.
- Mỗi bên mở rộng độc lập, không ảnh hưởng nhau.
- 1 external_user có 0 hoặc 1 buyer record, và 0 hoặc 1 seller record. Có thể có cả hai (vừa mua vừa bán).

Permission codes phase 1:

```txt
product:read
product:write
review:read
review:moderate
seller:read
seller:write
buyer:read
buyer:write
category:read
category:write
source:read
source:write
source:sync
ai:search
ai:review:analyze
ai:analyst:chat
```

### Seller Management

Core-service cần quản lý sellers:

- list/search/filter sellers;
- create seller;
- update seller;
- get seller detail;
- seller status;
- `user_id` FK nullable tới `identity.external_users` (phase 1 để NULL, phase 2 gán khi seller tự đăng ký).

### Buyer Management

Core-service cần quản lý buyers/customers:

- list/search/filter buyers;
- create buyer;
- update buyer;
- get buyer detail;
- buyer status;
- `user_id` FK nullable tới `identity.external_users` (phase 1 để NULL, phase 2 gán khi buyer tự đăng ký).

### Category And Attribute Management

Core-service cần quản lý:

- category tree;
- create/update category;
- category status;
- category attributes;
- attribute metadata: code, label, data type, filterable, searchable, required, unit, options.

### Product Catalog

Core-service cần quản lý canonical products:

- list/search/filter products;
- create/update product;
- product detail;
- product variants;
- product images;
- `specs_json`;
- product status.

Product phải liên kết với seller và category.

Product specs dùng hybrid model:

```txt
products.specs_json
product_variants.specs_json
category_attributes
```

### Reviews

Core-service cần quản lý review gốc:

- list/search/filter reviews;
- create/import review;
- review detail;
- moderation status;
- relation với product, seller và buyer.

AI analysis không lưu trực tiếp trong bảng review gốc. Các kết quả sentiment/topics/summary thuộc `commerce-ai-platform`.

### Basic Orders

Core-service cần có order cơ bản cho analytics:

- orders;
- order items;
- buyer relation;
- seller relation;
- product/variant relation;
- status;
- payment_status giả lập.

Không cần payment/shipping integration thật trong phase 1.

### Data Source And Import

Core-service cần hỗ trợ:

- data source registry;
- import CSV/JSON;
- sync run history;
- raw snapshot metadata;
- source products;
- source reviews;
- mapping từ source records sang canonical products/reviews.

Phase đầu có thể nhập dữ liệu realistic qua import/seeder. Sau này crawler/API/feed sẽ cắm vào cùng model này.

### Analytics

Core-service cần cung cấp analytics views hoặc API cho AI analyst:

- product performance;
- review sentiment aggregate;
- seller performance;
- category summary.

AI Platform sẽ ưu tiên query analytics views trước khi query bảng core whitelist.

## 3. Required Database Ownership

Core-service sở hữu các schema logic:

```txt
identity    (users, permissions, user_permissions, external_users)
marketplace (sellers, buyers, categories, category_attributes, products, product_variants, product_images, reviews, orders, order_items)
ingestion   (data_sources, sync_runs, raw_snapshots, source_products, source_reviews)
analytics
```

AI Platform chỉ được read-only trên phần whitelist của các schema này.

## 4. Required API Groups

Chi tiết draft nằm ở `docs/api-contracts/core-api.md`.

Core-service cần expose các nhóm API:

```txt
Auth
Users And Permissions
Sellers
Buyers
Categories
Category Attributes
Products
Reviews
Data Sources And Imports
Analytics
```

## 5. Minimum Done Criteria Cho Core Phase 1

Core-service được xem là đủ để Admin và AI bắt đầu tích hợp khi:

```txt
1. Admin login được và lấy được permissions.
2. Admin CRUD được category, category attributes, sellers, buyers, products và reviews.
3. `external_users` table tồn tại, sellers và buyers có `user_id` FK nullable.
4. Admin import được product/review dataset qua source/import flow.
5. Database có realistic dataset để AI index.
6. Analytics views/API đủ cho text-to-SQL analyst.
7. AI Platform có read-only access an toàn vào dữ liệu cần thiết.
```

## 6. Reference Docs

- `docs/modules/core-service.md`
- `docs/modules/database-model.md`
- `docs/modules/ingestion.md`
- `docs/modules/permissions.md`
- `docs/api-contracts/core-api.md`
- `docs/architecture/service-boundaries.md`
- `docs/architecture/data-flow.md`

## 7. Update Rule For Java Owner

Backend Java owner chỉ cần update file này khi thấy phần core-service thiếu, sai hoặc cần làm rõ:

```txt
docs/core-service/implementation-brief.md
```

Không cần sửa nhiều docs khác trong cùng một PR.

Nếu thay đổi chỉ là làm rõ trách nhiệm core-service, sửa trực tiếp section liên quan trong file này.

Nếu thay đổi ảnh hưởng lớn tới schema, API contract, service boundary hoặc phase scope, ghi rõ vào section `Requested Spec Changes` bên dưới. Sau khi PR được review, docs owner sẽ đồng bộ các file liên quan như:

```txt
docs/modules/database-model.md
docs/api-contracts/core-api.md
docs/modules/core-service.md
docs/architecture/data-flow.md
```

Quy ước branch:

```txt
docs/core-service-brief-update
```

Quy ước commit:

```txt
docs(core): update implementation brief
```

## 8. Requested Spec Changes

Ghi các đề xuất thay đổi lớn ở đây theo format:

```md
### <ngày> - <tiêu đề ngắn>

Lý do:
- ...

Đề xuất thay đổi:
- ...

Ảnh hưởng dự kiến:
- Schema:
- API:
- Admin:
- AI Platform:
```

Nếu chưa có thay đổi lớn, giữ section này trống.
