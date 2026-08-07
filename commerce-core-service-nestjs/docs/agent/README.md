# Agent Docs

This folder gives AI agents enough local context to work on `commerce-core-service-nestjs/` without relying on prior chat history.

## What This Service Is

`commerce-core-service-nestjs` is the NestJS implementation of the marketplace Core service. It replaces the planned Java `commerce-core-service` in this checkout.

It owns these PostgreSQL schemas:

```txt
identity
marketplace
ingestion
analytics
```

It does not own the AI schema. AI features belong to the future `commerce-ai-platform`.

## Source Of Truth

Read in this order when context is needed:

```txt
commerce-core-service-nestjs/AGENTS.md
commerce-core-service-nestjs/docs/agent/rules.md
commerce-core-service-nestjs/docs/agent/architecture.md
commerce-core-service-nestjs/docs/agent/api-boundaries.md
commerce-core-service-nestjs/docs/agent/workflows.md
commerce-core-service-nestjs/docs/agent/known-plans.md
../AGENTS.md
../docs/architecture/service-boundaries.md
../docs/modules/database-model.md
../docs/api-contracts/core-api.md
```

## Current Implementation Snapshot

- Global API prefix is `/api`.
- Current business routes are CMS routes under `/api/cms/*`.
- `AuthModule` registers JWT and permission guards globally with `APP_GUARD`.
- `/api/health` and `/api/cms/auth/login` are public through `@Public()`.
- Admin/internal users use `identity.users`.
- Client/external users are represented by `identity.external_users`, but client auth/routes are not implemented yet.
- Domain modules currently include auth, users-permissions, categories, sellers, buyers, products, reviews, orders, ingestion, analytics, database, and seeder.

## Current Cleanup Direction

The service is moving toward:

- explicit CMS controller names;
- separate CMS and client DTO folders;
- lean mutation responses;
- Vietnamese client-facing messages;
- normalized error responses.

See `known-plans.md` for plan files already written.

Use `rules.md` as the compact rulebook before changing controllers, DTOs, response contracts, auth boundaries, database access, or tests.
