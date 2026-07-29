# Data Flow

## Product Catalog Flow

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

## Review Flow

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

## Import/Source Flow

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

## Product Indexing Flow

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

## Semantic Search Flow

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

## Review Intelligence Flow

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

## Text-to-SQL Analyst Flow

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

