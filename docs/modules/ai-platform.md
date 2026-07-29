# AI Platform

AI Platform dùng NestJS.

## Module Chính

```txt
providers
vector-store
indexing
semantic-search
review-intelligence
analyst-chat
sql-safety
ai-logs
```

## Provider Abstraction

Interface:

```txt
EmbeddingProvider
ChatProvider
```

Ban đầu có thể dùng OpenAI hoặc local/Ollama. Service code không phụ thuộc trực tiếp vào một vendor.

## Vector Store

Mặc định:

```txt
PostgreSQL + pgvector
```

Tables AI:

```txt
product_embeddings
review_embeddings
review_ai_analysis
product_ai_summaries
ai_chat_sessions
ai_chat_messages
ai_query_logs
```

## Semantic Product Search

Search là hybrid:

- vector similarity;
- structured filters;
- AI explanation.

Kết quả gồm:

- product id;
- title;
- category;
- seller nếu có;
- similarity score;
- matched fields;
- explanation;
- filter metadata.

## Review Intelligence

Phase 1 gồm:

- sentiment analysis;
- topic extraction;
- complaint/praise labels;
- product review summary.

RAG Q&A trên review để phase sau.

## Text-to-SQL Analyst

Text-to-SQL được làm trong phase 1, nhưng có guardrail:

- chỉ `SELECT`;
- ưu tiên analytics views;
- whitelist bảng/cột core khi cần drill-down;
- block mutation query;
- default `LIMIT`;
- timeout;
- read-only DB user;
- audit log;
- hiển thị SQL cho admin.

## Framework Extension

Phase 1 tự viết orchestration nhẹ, chưa dùng LangChain/LangGraph. Các service orchestration phải tách rõ để sau này có thể chuyển sang LangGraph nếu analyst workflow phức tạp hơn.

