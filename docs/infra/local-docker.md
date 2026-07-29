# Local Docker Design

Repo `commerce-platform-infra` chạy full system bằng Docker Compose.

Repo layout trên máy:

```txt
Ecommerc/
  commerce-admin/
  commerce-core-service/
  commerce-ai-platform/
  commerce-platform-infra/
```

## Services

```txt
postgres
redis
minio
commerce-core-service
commerce-ai-platform
commerce-admin
```

## PostgreSQL

Dùng image có pgvector:

```txt
pgvector/pgvector
```

Schema logic:

```txt
identity
marketplace
ingestion
ai
analytics
```

Core-service sở hữu:

```txt
identity
marketplace
ingestion
analytics
```

AI Platform sở hữu:

```txt
ai
```

AI Platform cần DB user read-only cho core schema và DB user write cho AI schema.

## Redis

Redis dùng cho:

- indexing jobs;
- review analysis jobs;
- optional cache.

## MinIO

MinIO dùng cho:

- raw HTML/file snapshot;
- product images nếu chưa dùng cloud storage.

## Healthchecks

Docker full system được xem là chạy ổn khi có healthcheck cho:

- PostgreSQL;
- Redis;
- MinIO;
- Core-service;
- AI Platform;
- Admin.

