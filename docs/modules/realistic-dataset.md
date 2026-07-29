# Realistic Dataset

Phase 1 cần dữ liệu synthetic realistic, không phải mock sơ sài. Mục tiêu là tạo data đủ đa dạng để test admin workflow, semantic search, review intelligence và text-to-SQL.

## Category Scope

```txt
electronics
fashion
beauty
home-living
sports-outdoor
```

## Dataset Size Gợi Ý

Bản dev đầu:

```txt
50 sellers
2,000 products
4,000 variants
12,000 reviews
3,000 buyers
2,000 orders
```

Bản stress nhẹ:

```txt
200 sellers
20,000 products
40,000 variants
150,000 reviews
50,000 buyers
30,000 orders
```

## Product Pattern Theo Category

### Electronics

Attributes:

```txt
brand
model
ram
storage
screen_size
battery_life
warranty_months
connectivity
```

Review topics:

```txt
pin
hiệu năng
màn hình
bảo hành
độ bền
giá
```

### Fashion

Attributes:

```txt
brand
size
color
material
gender
style
season
```

Review topics:

```txt
form dáng
chất liệu
size
màu sắc
đường may
độ thoải mái
```

### Beauty

Attributes:

```txt
brand
skin_type
volume
ingredients
origin
expiry_months
```

Review topics:

```txt
dị ứng
mùi hương
hiệu quả
kết cấu
bao bì
giá
```

### Home Living

Attributes:

```txt
brand
material
dimensions
room_type
color
weight
```

Review topics:

```txt
độ chắc chắn
chất liệu
kích thước
lắp đặt
thiết kế
đóng gói
```

### Sports Outdoor

Attributes:

```txt
brand
activity_type
size
material
waterproof
weight
```

Review topics:

```txt
độ bền
độ nhẹ
chống nước
thoải mái
ma sát
phù hợp hoạt động
```

## Review Generation Rules

Review cần có pattern, không random hoàn toàn:

- Rating 5 thường có praise rõ.
- Rating 1-2 thường có complaint rõ.
- Rating 3 pha cả điểm tốt và điểm yếu.
- Review phải nhắc đến attribute/category topic.
- Mỗi product nên có mix review để summary có ý nghĩa.
- Một số seller/source có chất lượng thấp hơn để analyst chat phát hiện pattern.

## Order Generation Rules

Order phục vụ analytics:

- Có seasonal pattern theo category.
- Có seller performance khác nhau.
- Có product bán tốt nhưng rating giảm.
- Có category doanh thu tăng/giảm theo thời gian.
- Có buyer mua lại nhiều lần.

## Source Simulation

Seeder/import nên tạo dữ liệu qua source layer:

```txt
data_sources
sync_runs
raw_snapshots
source_products/source_reviews
canonical products/reviews
```

Như vậy data phase đầu giống dữ liệu sync thật, không bypass ingestion model.

