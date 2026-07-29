# Ingestion Và Source Registry

Phase 1 chưa làm crawler production, nhưng data model phải sẵn sàng cho hybrid ingestion:

- API/feed/dataset;
- import CSV/JSON;
- crawler/scraper sau này.

## Tables

Core-service sở hữu:

```txt
data_sources
sync_runs
raw_snapshots
source_products
source_reviews
```

## Source Registry

`data_sources` mô tả nguồn dữ liệu:

- tên source;
- loại source: API, feed, dataset, scraper;
- base URL hoặc config reference;
- trạng thái active/inactive;
- rate limit/config metadata nếu cần.

## Sync Runs

`sync_runs` lưu mỗi lần import/sync:

- source id;
- started_at;
- finished_at;
- status;
- total records;
- success count;
- failed count;
- error summary.

## Raw Snapshots

Raw storage dùng hybrid:

- Raw JSON nhỏ lưu trong PostgreSQL JSONB.
- Raw HTML/file lớn lưu trong MinIO/object storage.
- DB lưu metadata, hash, object key/url, parse status.

## Mapping

```txt
source_products/source_reviews
   |
   v
canonical products/reviews
```

Sau này dedupe/matching có thể map nhiều source records vào một canonical product.

