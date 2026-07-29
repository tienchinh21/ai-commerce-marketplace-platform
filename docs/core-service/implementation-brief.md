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
- seller status.

### Buyer Management

Core-service cần quản lý buyers/customers:

- list/search/filter buyers;
- create buyer;
- update buyer;
- get buyer detail;
- buyer status.

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
identity
marketplace
ingestion
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
3. Admin import được product/review dataset qua source/import flow.
4. Database có realistic dataset để AI index.
5. Analytics views/API đủ cho text-to-SQL analyst.
6. AI Platform có read-only access an toàn vào dữ liệu cần thiết.
```

## 6. Reference Docs

- `docs/modules/core-service.md`
- `docs/modules/database-model.md`
- `docs/modules/ingestion.md`
- `docs/modules/permissions.md`
- `docs/api-contracts/core-api.md`
- `docs/architecture/service-boundaries.md`
- `docs/architecture/data-flow.md`

