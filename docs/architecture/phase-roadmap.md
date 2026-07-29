# Phase Roadmap

Roadmap chọn hướng Admin + AI song song, nhưng vẫn giữ data foundation làm nền.

## M1: Foundation + Catalog Admin

Mục tiêu:

- Chạy được infra local.
- Admin login được.
- Permission-based menu hoạt động.
- Quản lý category, category attributes, seller và product.

Kết quả mong muốn:

```txt
Admin có thể tạo category -> định nghĩa attributes -> tạo seller -> tạo product/variant/image/specs_json.
```

AI ở milestone này chỉ cần chuẩn bị contract và module skeleton trong thiết kế, chưa bắt buộc có semantic search chạy hoàn chỉnh.

## M2: Review + Source/Import + Realistic Dataset

Mục tiêu:

- Quản lý review.
- Quản lý data source.
- Import CSV/JSON.
- Lưu sync run/raw snapshot/source product/source review.
- Tạo realistic dataset cho 5 category.

Kết quả mong muốn:

```txt
Hệ thống có dataset đủ lớn và đủ đa dạng để AI search, review intelligence và analyst chat xử lý có ý nghĩa.
```

## M3: Semantic Product Search

Mục tiêu:

- Index product vào pgvector.
- Search bằng natural language.
- Kết hợp structured filters.
- Trả similarity score và explanation.

Kết quả mong muốn:

```txt
Admin search: "giày chạy bộ nhẹ cho người mới dưới 2 triệu"
AI trả product phù hợp, có score, filter và lý do match.
```

## M4: Review Intelligence

Mục tiêu:

- Phân tích sentiment.
- Extract topics.
- Gán complaint/praise labels.
- Tạo product review summary.

Kết quả mong muốn:

```txt
Admin xem được điểm mạnh/yếu của từng product dựa trên review, kèm số lượng review và confidence.
```

## M5: Text-to-SQL Analyst

Mục tiêu:

- Admin hỏi dữ liệu bằng tiếng Việt.
- LLM sinh SQL read-only.
- SQL safety validator kiểm tra.
- Execute bằng read-only DB user.
- Trả answer, SQL, table và chart suggestion.

Kết quả mong muốn:

```txt
Admin hỏi: "Top 10 sản phẩm có review tiêu cực nhiều nhất trong category beauty là gì?"
AI trả câu trả lời, SQL đã chạy, bảng kết quả và gợi ý chart.
```

## Sau Phase 1

Ưu tiên mở rộng:

```txt
1. Seller portal
2. Buyer web client bằng Next.js
3. Cart/wishlist/checkout cơ bản
4. Crawler adapters
5. Product matching/deduplication nâng cao
6. RAG Q&A trên review
```

