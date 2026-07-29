# Tổng Quan Kiến Trúc

Phase 1 là marketplace platform theo hướng admin-first, có AI Platform chạy song song trên dữ liệu marketplace.

Repo phase 1:

```txt
commerce-admin
commerce-core-service
commerce-ai-platform
commerce-platform-infra
```

Mục tiêu không phải làm full ecommerce giống sàn lớn ngay từ đầu. Hệ thống cần có core marketplace đủ thật để tạo dữ liệu cho AI:

- seller;
- buyer/customer;
- category;
- dynamic attributes;
- product;
- variant;
- review;
- source/import;
- order cơ bản cho analytics.

Roadmap phase 1:

```txt
M1: Foundation + Catalog Admin
M2: Review + Data Source/Import + realistic dataset
M3: Semantic Product Search
M4: Review Intelligence
M5: Text-to-SQL Analyst
```

Phase sau mới tách seller portal và buyer web client.

