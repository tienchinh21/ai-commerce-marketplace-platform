# Text-to-SQL Safety

Text-to-SQL là module có rủi ro cao nhất trong AI Platform. Phase 1 cho phép làm thật, nhưng phải có guardrail rõ.

## Nguyên Tắc

```txt
AI được phép đọc dữ liệu, không được phép sửa dữ liệu.
```

## Data Access

AI Platform dùng DB user riêng:

- read-only trên analytics views;
- read-only trên một số bảng/cột core được whitelist;
- write chỉ trên schema `ai` cho logs/session nếu cần.

## SQL Generation Context

LLM chỉ được nhận schema context từ whitelist:

```txt
analytics.product_performance
analytics.review_sentiment
analytics.seller_performance
analytics.category_summary
marketplace.products selected columns
marketplace.reviews selected columns
marketplace.categories selected columns
marketplace.sellers selected columns
```

Không đưa toàn bộ database schema vào prompt.

## Safety Validator

Validator phải kiểm tra:

```txt
1. Query chỉ có một statement.
2. Statement là SELECT.
3. Không chứa mutation keywords.
4. Không query bảng/schema ngoài whitelist.
5. Không dùng function nguy hiểm.
6. Có LIMIT mặc định nếu query trả nhiều dòng.
7. Có timeout execution.
```

Mutation keywords bị block:

```txt
INSERT
UPDATE
DELETE
DROP
ALTER
TRUNCATE
CREATE
GRANT
REVOKE
COPY
VACUUM
```

## Execution Flow

```txt
Admin question
   |
   v
Build schema context từ whitelist
   |
   v
LLM generate SQL
   |
   v
Parse + validate SQL
   |
   v
Nếu fail: trả lỗi an toàn, không execute
   |
   v
Nếu pass: execute bằng read-only DB user
   |
   v
Log query + duration + row_count
   |
   v
LLM summarize result
```

## Response Shape

AI Analyst trả:

```txt
answer
generated_sql
columns
rows
chart_suggestion
safety_status
query_log_id
```

## Audit Log

`ai_query_logs` lưu:

```txt
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

## Failure Handling

Nếu SQL bị block:

- Không execute.
- Trả lý do ngắn.
- Có thể yêu cầu AI generate lại với constraint rõ hơn.
- Log safety failure để debug.

