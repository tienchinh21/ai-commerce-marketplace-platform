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

- Start here: `../docs/core-service/implementation-brief.md`
- `../docs/modules/core-service.md`
- `../docs/modules/database-model.md`
- `../docs/api-contracts/core-api.md`

## Docs Update Rule

If the Java owner needs to update requirements, update only:

```txt
../docs/core-service/implementation-brief.md
```

For large schema/API/scope changes, write them under `Requested Spec Changes` in that file. The docs owner will sync other docs after review.
