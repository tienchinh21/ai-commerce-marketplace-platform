# Service Boundaries

## commerce-admin

React + Vite + Ant Design.

Trách nhiệm:

- UI admin/CMS.
- Login flow và session handling.
- Permission-based menu/action rendering.
- Gọi Core API cho marketplace data.
- Gọi AI API cho AI search, review intelligence và analyst chat.

Không sở hữu business logic và không query database trực tiếp.

## commerce-core-service

Java Spring Boot.

Trách nhiệm:

- Auth và permission.
- Marketplace core data.
- Source registry/import/sync run/raw snapshot metadata.
- Analytics views hoặc API phục vụ reporting.

Core-service sở hữu schema:

```txt
identity
marketplace
ingestion
analytics
```

## commerce-ai-platform

NestJS.

Trách nhiệm:

- Provider abstraction cho embedding/chat.
- Product/review indexing.
- Vector search bằng pgvector.
- Review intelligence.
- Text-to-SQL analyst.
- AI logs và audit.

AI Platform sở hữu schema:

```txt
ai
```

AI Platform có thể đọc core data bằng read-only DB user, nhưng không update bảng core.

## commerce-platform-infra

Trách nhiệm:

- Docker Compose.
- PostgreSQL + pgvector.
- Redis.
- MinIO.
- Network/env/init scripts.
- Hướng dẫn chạy full system local.

