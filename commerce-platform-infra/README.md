# commerce-platform-infra

Docker Compose and local infrastructure for the AI Commerce Marketplace Platform.

## Services

- PostgreSQL + pgvector (pgvector/pgvector:pg16)
- Redis (redis:7-alpine)
- MinIO (minio/minio:latest)

App services (core-service, ai-platform, admin) run locally on the host and connect to these containers.

## Start

```bash
docker compose up -d
```

## Ports

| Service  | Host port | Notes                                  |
| -------- | --------- | -------------------------------------- |
| Postgres | 5432      |                                        |
| Redis    | 6379      |                                        |
| MinIO    | 9000      | API                                    |
| MinIO    | 9001      | Console (minioadmin/minioadmin)        |
| (host)   | 8080      | core-service (NestJS, default PORT)    |
| (host)   | 3001      | ai-platform (when scaffolded)          |

## Stop / Down

```bash
docker compose stop    # keep volumes
docker compose down    # remove containers (volumes kept)
docker compose down -v # remove containers + volumes (data wiped)
```

## Connection

- DB URL: `postgres://${POSTGRES_USER:-postgres}:${POSTGRES_PASSWORD:-postgres}@localhost:5432/${POSTGRES_DB:-commerce}`
- Schemas: `identity`, `marketplace`, `ingestion`, `analytics` (core-service), `ai` (ai-platform)
- Redis: `redis://localhost:6379`
- MinIO console: http://localhost:9001

## Env

Override defaults via the `${VAR:-default}` variables in `docker-compose.yml` (postgres user/password/db, minio credentials).
