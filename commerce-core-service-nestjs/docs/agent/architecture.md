# Architecture Notes

## Stack

- NestJS 11
- TypeScript 5.7
- TypeORM
- PostgreSQL with pgvector extension enabled by bootstrap when `DB_SYNCHRONIZE=true`
- JWT auth via `@nestjs/jwt`, Passport JWT, and `bcryptjs`
- Swagger via `@nestjs/swagger`
- Jest for tests

## Bootstrap

`src/main.ts`:

- loads env with `loadEnv()`;
- ensures schemas when database synchronization is enabled;
- creates the Nest app;
- sets global prefix `api`;
- enables CORS from configured origins;
- registers global `ValidationPipe`;
- mounts Swagger at `/api/docs`.

## Module Pattern

Each domain lives under `src/modules/<domain>/`.

Expected file roles:

```txt
*.module.ts       -> Nest module wiring
cms-*.controller.ts -> internal admin/CMS HTTP route surface
client-*.controller.ts -> future public buyer/seller/client HTTP route surface
*.service.ts      -> business/application logic
*.entity.ts       -> TypeORM persistence model
dto/cms/*.dto.ts  -> CMS input and response contracts
dto/client/*.dto.ts -> future client-facing contracts
*.spec.ts         -> focused tests
```

Domain folders should not be treated as API-audience folders. For example, `src/modules/products/` is the product domain; CMS/client separation should happen inside the module through controller and DTO naming.

When adding a future client route, add `client-*.controller.ts` and `dto/client/*` beside the existing CMS files. Keep shared persistence and application logic in the domain service unless the client behavior requires a clearly separate service method.

## Database Ownership

Core owns:

```txt
identity.users
identity.external_users
identity.permissions
identity.user_permissions
marketplace.*
ingestion.*
analytics.*
```

Do not write to `ai.*` from this service. Future AI Platform owns `ai.*`.

## Auth And Permissions

`AuthModule` registers:

```txt
JwtAuthGuard       -> global auth guard
PermissionsGuard   -> global permission guard
```

Public endpoints need `@Public()`.

CMS endpoints use admin/internal JWTs from `identity.users` and permission codes such as:

```txt
product:read
product:write
category:read
category:write
source:read
source:write
source:sync
ai:analyst:chat
```

Future client endpoints should not reuse CMS permission checks. Client endpoints should be public or use external-user auth from `identity.external_users`.

## Response Contract

GET endpoints should return explicit response DTOs, not TypeORM entities.

Mutation endpoints should return lean acknowledgements:

```json
{ "success": true, "id": "550e8400-e29b-41d4-a716-446655440000", "message": "Tạo sản phẩm thành công." }
```

or:

```json
{ "success": true, "message": "Cập nhật sản phẩm thành công." }
```

DELETE endpoints should use `204 No Content`.

Sensitive/heavy fields should not be returned by default:

```txt
passwordHash
configJson
rawJson
rawDataJson
normalizedDataJson
metadata that is not needed by the caller
```
