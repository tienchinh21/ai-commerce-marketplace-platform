# commerce-ai-platform

NestJS AI service for semantic search, review intelligence and text-to-SQL analyst.

## Responsibilities

- Provider abstraction for embedding and chat models.
- Product/review indexing.
- PostgreSQL + pgvector vector search.
- Review sentiment/topic/summary generation.
- Text-to-SQL analyst with strict read-only safety guardrails.
- AI query logs and job status APIs.

## Data Boundary

- Read core data through Core API or PostgreSQL read-only user.
- Write only to AI schema/tables.
- Do not update marketplace core tables directly.

