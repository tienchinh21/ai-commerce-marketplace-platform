# AI API Draft

AI API phục vụ Admin CMS và có thể gọi Core API khi cần.

## Indexing

```txt
POST /ai/indexing/products/run
POST /ai/indexing/products/:productId/run
GET /ai/indexing/products/jobs/:jobId

POST /ai/indexing/reviews/run
POST /ai/indexing/reviews/:reviewId/run
GET /ai/indexing/reviews/jobs/:jobId
```

## Semantic Search

```txt
POST /ai/search/products
```

Request concept:

```json
{
  "query": "áo khoác chống nước đi du lịch mùa mưa",
  "filters": {
    "category": "fashion",
    "priceMin": 0,
    "priceMax": 2000000,
    "brand": null,
    "ratingMin": 4
  },
  "limit": 20
}
```

Response concept:

```json
{
  "items": [
    {
      "productId": "uuid",
      "title": "Tên sản phẩm",
      "score": 0.82,
      "explanation": "Phù hợp vì có chất liệu chống nước và đánh giá tốt cho du lịch."
    }
  ]
}
```

## Review Intelligence

```txt
POST /ai/reviews/analyze/run
POST /ai/reviews/:reviewId/analyze
GET /ai/products/:productId/review-summary
GET /ai/reviews/analysis
```

## Analyst Chat

```txt
POST /ai/analyst/chat
GET /ai/analyst/sessions
GET /ai/analyst/sessions/:id/messages
GET /ai/query-logs
```

Response cần có:

- answer;
- generated SQL;
- table result;
- chart suggestion nếu phù hợp;
- safety status;
- query log id.

