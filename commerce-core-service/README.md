# commerce-core-service

Spring Boot Java core backend for marketplace data, auth, permissions and ingestion foundation.

This repo is owned by the Java backend engineer. This planning workspace documents what the service must provide, but does not prescribe Java implementation details.

## Required Responsibilities

- Auth and permission-based authorization.
- Sellers and buyers.
- Categories and category attributes.
- Products, variants and images.
- Reviews.
- Basic orders for analytics.
- Data sources, sync runs, raw snapshots, source products and source reviews.
- Analytics views/API for AI analyst.

## Required Consumers

- `commerce-admin`
- `commerce-ai-platform`

## Reference Docs

- `../docs/modules/core-service.md`
- `../docs/modules/database-model.md`
- `../docs/api-contracts/core-api.md`
- `../docs/core-service/implementation-brief.md`

