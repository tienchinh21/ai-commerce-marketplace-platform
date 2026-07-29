# Database Model Phase 1

Tài liệu này mô tả data model cấp bảng. Đây chưa phải migration chi tiết.

## Schema Logic

```txt
identity
marketplace
ingestion
ai
analytics
```

## identity.users

Lưu admin/internal users (người vận hành CMS). Không dùng cho seller hay buyer.

Field chính:

```txt
id
email
password_hash
display_name
status
created_at
updated_at
```

## identity.external_users

Lưu tài khoản người dùng bên ngoài (seller/buyer tự đăng ký qua seller portal hoặc buyer app). Tách riêng khỏi `identity.users` vì:

- Admin users có permission system, roles, departments riêng.
- External users không cần các khái niệm đó.
- Tránh phải JOIN lọc role mỗi lần query admin users.
- Mỗi bên mở rộng độc lập, không ảnh hưởng nhau.

Field chính:

```txt
id
email
password_hash
display_name
phone
status
created_at
updated_at
```

Quan hệ:

- 1 external_user có 0 hoặc 1 `marketplace.buyers` record (có thể chưa có buyer profile, nhưng nếu có thì chỉ 1).
- 1 external_user có 0 hoặc 1 `marketplace.sellers` record (có thể chưa mở shop, nhưng nếu có thì chỉ 1).
- Một người có thể vừa có buyer record vừa có seller record (vừa mua vừa bán).

## identity.permissions

Field chính:

```txt
id
code
description
created_at
```

`code` dùng format:

```txt
resource:action
```

Ví dụ:

```txt
product:read
product:write
ai:analyst:chat
```

## identity.user_permissions

Field chính:

```txt
user_id
permission_id
created_at
```

## marketplace.sellers

Seller tồn tại trong core data ngay từ phase 1, dù chưa có seller portal.

Field chính:

```txt
id
user_id
name
slug
status
rating_avg
metadata_json
created_at
updated_at
```

`user_id` là FK nullable tới `identity.external_users`. Phase 1 admin import seller thì `user_id` để NULL. Phase 2 khi có seller portal, seller tự đăng ký tài khoản → tạo `external_users` record → `seller.user_id` được gán.

## marketplace.buyers

Buyer/customer tồn tại để phục vụ review/order/analytics.

Field chính:

```txt
id
user_id
email
display_name
phone
status
metadata_json
created_at
updated_at
```

`user_id` là FK nullable tới `identity.external_users`. Phase 1 admin import buyer thì `user_id` để NULL. Phase 2 khi có buyer app, buyer tự đăng ký → tạo `external_users` record → `buyer.user_id` được gán.

## marketplace.categories

Field chính:

```txt
id
parent_id
name
slug
path
level
status
created_at
updated_at
```

`path` giúp hiển thị category tree và đưa category context vào embedding.

## marketplace.category_attributes

Định nghĩa attribute quan trọng theo category.

Field chính:

```txt
id
category_id
code
label
data_type
is_filterable
is_searchable
is_required
unit
options_json
created_at
updated_at
```

Ví dụ:

```txt
electronics.ram
fashion.size
beauty.skin_type
home_living.material
sports_outdoor.activity_type
```

## marketplace.products

Canonical product.

Field chính:

```txt
id
seller_id
category_id
title
slug
brand
description
status
price_min
price_max
rating_avg
review_count
specs_json
created_at
updated_at
```

`specs_json` giữ dữ liệu linh hoạt từ admin/import/source.

## marketplace.product_variants

Field chính:

```txt
id
product_id
sku
title
price
stock_quantity
status
specs_json
created_at
updated_at
```

## marketplace.product_images

Field chính:

```txt
id
product_id
variant_id
url
storage_key
sort_order
alt_text
created_at
```

## marketplace.reviews

Field chính:

```txt
id
product_id
buyer_id
seller_id
rating
title
content
status
source_type
source_review_id
created_at
updated_at
```

AI sentiment/topics không lưu trực tiếp vào bảng review, mà lưu trong schema AI.

## marketplace.orders

Order cơ bản cho analytics.

Field chính:

```txt
id
buyer_id
seller_id
status
payment_status
total_amount
currency
ordered_at
created_at
updated_at
```

## marketplace.order_items

Field chính:

```txt
id
order_id
product_id
variant_id
quantity
unit_price
total_price
created_at
```

## ingestion.data_sources

Field chính:

```txt
id
name
type
base_url
status
config_json
created_at
updated_at
```

`type` có thể là:

```txt
api
feed
dataset
scraper
manual_import
```

## ingestion.sync_runs

Field chính:

```txt
id
data_source_id
status
started_at
finished_at
total_records
success_count
failed_count
error_summary
metadata_json
```

## ingestion.raw_snapshots

Field chính:

```txt
id
data_source_id
sync_run_id
content_type
content_hash
raw_json
object_storage_key
parse_status
error_message
created_at
```

Raw JSON nhỏ lưu `raw_json`. Raw HTML/file lớn lưu trong MinIO và DB chỉ lưu `object_storage_key`.

## ingestion.source_products

Field chính:

```txt
id
data_source_id
sync_run_id
raw_snapshot_id
canonical_product_id
source_product_id
source_url
raw_data_json
normalized_data_json
mapping_status
created_at
updated_at
```

## ingestion.source_reviews

Field chính:

```txt
id
data_source_id
sync_run_id
raw_snapshot_id
canonical_review_id
source_review_id
source_product_id
raw_data_json
normalized_data_json
mapping_status
created_at
updated_at
```

## ai.product_embeddings

Field chính:

```txt
id
product_id
embedding
embedding_model
embedding_version
source_text_hash
created_at
updated_at
```

`embedding` dùng pgvector.

## ai.review_embeddings

Field chính:

```txt
id
review_id
embedding
embedding_model
embedding_version
source_text_hash
created_at
updated_at
```

## ai.review_ai_analysis

Field chính:

```txt
id
review_id
sentiment
sentiment_score
topics_json
complaints_json
praises_json
model
created_at
updated_at
```

## ai.product_ai_summaries

Field chính:

```txt
id
product_id
strengths_json
weaknesses_json
common_complaints_json
common_praises_json
recommended_buyer_profile
confidence
source_review_count
model
created_at
updated_at
```

## ai.ai_query_logs

Field chính:

```txt
id
user_id
question
generated_sql
safety_status
execution_status
row_count
duration_ms
error_message
created_at
```

