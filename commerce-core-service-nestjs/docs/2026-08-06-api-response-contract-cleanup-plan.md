# API Response Contract Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make CMS API responses return only the data each HTTP method needs, with safe DTO serialization and lean mutation acknowledgements instead of returning full TypeORM entities after create/update/delete.

**Architecture:** Keep services responsible for business work and persistence, but stop exposing entity instances as the public response contract. Add explicit response DTOs, small shared mutation DTOs, and controller-level mapping so GET endpoints return stable read projections while POST/PATCH/PUT/DELETE endpoints return status-only or id-only acknowledgements. Use NestJS Swagger decorators and focused controller tests to lock response shapes.

**Tech Stack:** NestJS 11, TypeScript 5.7, TypeORM, class-transformer, class-validator, Jest, @nestjs/testing, @nestjs/swagger.

## Global Constraints

- Do not change database schemas, migrations, entity table/column mappings, permission codes, auth guard behavior, or route paths.
- Preserve the global prefix `app.setGlobalPrefix('api')`; all reviewed business endpoints stay under `/api/cms/*`.
- Do not return `passwordHash`, `configJson`, or `rawJson` from CMS API responses unless a future task explicitly creates a secured detail endpoint for those fields.
- `POST` creates return `201 Created` with `{ success: true, id, message }`.
- `PATCH` and `PUT` updates return `200 OK` with `{ success: true, message }`.
- `DELETE` endpoints return `204 No Content` with no response body.
- Import endpoints return `201 Created` with a compact sync result: `{ success: boolean, syncRunId, status, totalRecords, successCount, failedCount, message }`.
- GET list/detail endpoints use response DTOs and must not expose TypeORM entity objects directly from controllers.
- Follow NestJS best practices: `api-use-dto-serialization`, `api-use-interceptors` where cross-cutting serialization is useful, and `security-sanitize-output` for safe outward data.
- Keep changes scoped to `commerce-core-service-nestjs`; update `commerce-admin` only if a later execution task confirms the frontend depends on mutation response bodies.

---

## Current Problems To Fix

- `POST` and `PATCH` in `categories`, `products`, `sellers`, `buyers`, `reviews`, `orders`, and `ingestion/data-sources` currently return full entities from service `save()` calls.
- `POST /api/cms/users` can return the newly created `User` object containing `passwordHash` because the object is created in memory before response serialization.
- `DELETE /api/cms/categories/*` and `DELETE /api/cms/products/:id` return `void` but keep Nest's default `200 OK`; the intended contract is `204 No Content`.
- Existing Swagger decorators document entity types as API response types, making the generated contract wider than needed.
- Existing DTO files mostly document Swagger schemas; there is no consistent runtime response mapping using `plainToInstance(..., { excludeExtraneousValues: true })`.

## Target Contract Matrix

```txt
POST /api/cms/auth/login -> keep existing LoginResponseDto: { accessToken, user: { id, email, displayName, permissions } }
GET /api/cms/auth/me -> keep existing MeResponseDto
GET /api/cms/auth/me/permissions -> keep existing MePermissionsResponseDto

GET /api/cms/users -> UserResponseDto[]: id, email, displayName, status, createdAt, updatedAt
POST /api/cms/users -> CreatedResourceResponseDto
GET /api/cms/permissions -> PermissionResponseDto[]: id, code, description, createdAt
GET /api/cms/users/:id/permissions -> string[]
PUT /api/cms/users/:id/permissions -> MutationSuccessResponseDto

GET /api/cms/categories -> CategoryResponseDto[]
POST /api/cms/categories -> CreatedResourceResponseDto
GET /api/cms/categories/:id -> CategoryResponseDto
PATCH /api/cms/categories/:id -> MutationSuccessResponseDto
DELETE /api/cms/categories/:id -> 204 No Content
GET /api/cms/categories/:id/attributes -> CategoryAttributeResponseDto[]
POST /api/cms/categories/:id/attributes -> CreatedResourceResponseDto
PATCH /api/cms/categories/attributes/:attributeId -> MutationSuccessResponseDto
DELETE /api/cms/categories/attributes/:attributeId -> 204 No Content

GET /api/cms/sellers -> PaginatedResponseDto<SellerResponseDto>
POST /api/cms/sellers -> CreatedResourceResponseDto
GET /api/cms/sellers/:id -> SellerDetailResponseDto
PATCH /api/cms/sellers/:id -> MutationSuccessResponseDto

GET /api/cms/buyers -> PaginatedResponseDto<BuyerResponseDto>
POST /api/cms/buyers -> CreatedResourceResponseDto
GET /api/cms/buyers/:id -> BuyerDetailResponseDto
PATCH /api/cms/buyers/:id -> MutationSuccessResponseDto

GET /api/cms/products -> PaginatedResponseDto<ProductResponseDto>
POST /api/cms/products -> CreatedResourceResponseDto
GET /api/cms/products/:id -> ProductDetailResponseDto
PATCH /api/cms/products/:id -> MutationSuccessResponseDto
DELETE /api/cms/products/:id -> 204 No Content
GET /api/cms/products/:id/variants -> ProductVariantResponseDto[]
POST /api/cms/products/:id/variants -> CreatedResourceResponseDto
POST /api/cms/products/:id/images -> BulkCreatedResourceResponseDto

GET /api/cms/reviews -> PaginatedResponseDto<ReviewResponseDto>
POST /api/cms/reviews -> CreatedResourceResponseDto
GET /api/cms/reviews/:id -> ReviewResponseDto
PATCH /api/cms/reviews/:id -> MutationSuccessResponseDto

GET /api/cms/orders -> PaginatedResponseDto<OrderResponseDto>
POST /api/cms/orders -> CreatedResourceResponseDto
GET /api/cms/orders/:id -> OrderDetailResponseDto

GET /api/cms/data-sources -> DataSourceResponseDto[] without configJson
POST /api/cms/data-sources -> CreatedResourceResponseDto
GET /api/cms/data-sources/:id -> DataSourceResponseDto without configJson
PATCH /api/cms/data-sources/:id -> MutationSuccessResponseDto
GET /api/cms/sync-runs -> PaginatedResponseDto<SyncRunResponseDto>
GET /api/cms/sync-runs/:id -> SyncRunResponseDto
GET /api/cms/raw-snapshots -> PaginatedResponseDto<RawSnapshotResponseDto> without rawJson
GET /api/cms/raw-snapshots/:id -> RawSnapshotResponseDto without rawJson
POST /api/cms/imports/products -> ImportRunResponseDto
POST /api/cms/imports/reviews -> ImportRunResponseDto
```

## File Structure

- Create: `commerce-core-service-nestjs/src/shared/api/mutation-response.dto.ts`
  - Shared Swagger/runtime DTOs for mutation acknowledgements.
- Create: `commerce-core-service-nestjs/src/shared/api/response-serialization.ts`
  - Small helpers around `plainToInstance` for DTO mapping.
- Modify: `commerce-core-service-nestjs/src/shared/api/paginated-response.dto.ts`
  - Keep existing class and add a helper type if needed; do not break existing imports.
- Create: `commerce-core-service-nestjs/src/shared/api/response-serialization.spec.ts`
  - Unit tests for stripping unexposed fields.
- Create or modify response DTOs under each module's `dto/` folder:
  - `modules/users-permissions/dto/user-response.dto.ts`
  - `modules/users-permissions/dto/permission-response.dto.ts`
  - `modules/categories/dto/category-response.dto.ts`
  - `modules/categories/dto/category-attribute-response.dto.ts`
  - `modules/sellers/dto/seller-response.dto.ts`
  - `modules/buyers/dto/buyer-response.dto.ts`
  - `modules/products/dto/product-response.dto.ts`
  - `modules/products/dto/product-detail-response.dto.ts`
  - `modules/products/dto/product-variant-response.dto.ts`
  - `modules/products/dto/product-image-response.dto.ts`
  - `modules/reviews/dto/review-response.dto.ts`
  - `modules/orders/dto/order-response.dto.ts`
  - `modules/orders/dto/order-item-response.dto.ts`
  - `modules/ingestion/dto/data-source-response.dto.ts`
  - `modules/ingestion/dto/sync-run-response.dto.ts`
  - `modules/ingestion/dto/raw-snapshot-response.dto.ts`
  - `modules/ingestion/dto/import-run-response.dto.ts`
- Modify all CMS controllers under `commerce-core-service-nestjs/src/modules/**`.
  - Replace entity response decorators with response DTO decorators.
  - Map GET responses through DTO serializers.
  - Convert mutation handlers to acknowledgement DTOs.
  - Add `@HttpCode(HttpStatus.NO_CONTENT)` to delete handlers.
- Create controller tests next to each controller:
  - `categories.controller.spec.ts`
  - `products.controller.spec.ts`
  - `sellers.controller.spec.ts`
  - `buyers.controller.spec.ts`
  - `reviews.controller.spec.ts`
  - `orders.controller.spec.ts`
  - `ingestion.controller.spec.ts`
  - `users-permissions.controller.spec.ts`

## Implementation Tasks

### Task 1: Add Shared Mutation Response And Serialization Helpers

**Files:**
- Create: `commerce-core-service-nestjs/src/shared/api/mutation-response.dto.ts`
- Create: `commerce-core-service-nestjs/src/shared/api/response-serialization.ts`
- Create: `commerce-core-service-nestjs/src/shared/api/response-serialization.spec.ts`

**Interfaces:**
- Consumes: `plainToInstance` from `class-transformer`, existing `PaginatedResponseDto<T>` shape.
- Produces:
  - `MutationSuccessResponseDto`
  - `CreatedResourceResponseDto`
  - `BulkCreatedResourceResponseDto`
  - `createSuccess(message: string): MutationSuccessResponseDto`
  - `createCreated(id: string, message: string): CreatedResourceResponseDto`
  - `createBulkCreated(ids: string[], message: string): BulkCreatedResourceResponseDto`
  - `toResponseDto<T, V>(dtoClass: ClassConstructor<T>, value: V): T`
  - `toResponseDtoList<T, V>(dtoClass: ClassConstructor<T>, values: V[]): T[]`
  - `toPaginatedResponseDto<T, V>(dtoClass: ClassConstructor<T>, page: { items: V[]; total: number; page: number; pageSize: number }): { items: T[]; total: number; page: number; pageSize: number }`

- [ ] **Step 1: Write failing helper tests**

Create `src/shared/api/response-serialization.spec.ts`:

```ts
import { Expose } from 'class-transformer';
import {
  toPaginatedResponseDto,
  toResponseDto,
  toResponseDtoList,
} from './response-serialization';
import {
  createBulkCreated,
  createCreated,
  createSuccess,
} from './mutation-response.dto';

class TestUserDto {
  @Expose()
  id: string;

  @Expose()
  email: string;
}

describe('response serialization helpers', () => {
  it('removes fields that are not exposed on the response DTO', () => {
    const result = toResponseDto(TestUserDto, {
      id: 'user-1',
      email: 'admin@example.com',
      passwordHash: 'secret-hash',
    });

    expect(result).toEqual({ id: 'user-1', email: 'admin@example.com' });
    expect('passwordHash' in result).toBe(false);
  });

  it('maps arrays with the same field filtering', () => {
    const result = toResponseDtoList(TestUserDto, [
      { id: 'user-1', email: 'a@example.com', passwordHash: 'x' },
      { id: 'user-2', email: 'b@example.com', passwordHash: 'y' },
    ]);

    expect(result).toEqual([
      { id: 'user-1', email: 'a@example.com' },
      { id: 'user-2', email: 'b@example.com' },
    ]);
  });

  it('maps paginated response items without changing pagination metadata', () => {
    const result = toPaginatedResponseDto(TestUserDto, {
      items: [{ id: 'user-1', email: 'a@example.com', passwordHash: 'x' }],
      total: 1,
      page: 2,
      pageSize: 20,
    });

    expect(result).toEqual({
      items: [{ id: 'user-1', email: 'a@example.com' }],
      total: 1,
      page: 2,
      pageSize: 20,
    });
  });

  it('builds standard mutation acknowledgements', () => {
    expect(createSuccess('Updated successfully')).toEqual({
      success: true,
      message: 'Updated successfully',
    });
    expect(createCreated('resource-1', 'Created successfully')).toEqual({
      success: true,
      id: 'resource-1',
      message: 'Created successfully',
    });
    expect(createBulkCreated(['a', 'b'], 'Images added successfully')).toEqual({
      success: true,
      ids: ['a', 'b'],
      count: 2,
      message: 'Images added successfully',
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
cd commerce-core-service-nestjs
npm test -- response-serialization.spec.ts
```

Expected: FAIL because `response-serialization.ts` and `mutation-response.dto.ts` do not exist yet.

- [ ] **Step 3: Add shared DTO and helper implementation**

Create `src/shared/api/mutation-response.dto.ts`:

```ts
import { ApiProperty } from '@nestjs/swagger';

export class MutationSuccessResponseDto {
  @ApiProperty({ example: true })
  success: true;

  @ApiProperty({ example: 'Updated successfully' })
  message: string;
}

export class CreatedResourceResponseDto extends MutationSuccessResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;
}

export class BulkCreatedResourceResponseDto extends MutationSuccessResponseDto {
  @ApiProperty({ type: [String], format: 'uuid' })
  ids: string[];

  @ApiProperty({ example: 2 })
  count: number;
}

export function createSuccess(message: string): MutationSuccessResponseDto {
  return { success: true, message };
}

export function createCreated(
  id: string,
  message: string,
): CreatedResourceResponseDto {
  return { success: true, id, message };
}

export function createBulkCreated(
  ids: string[],
  message: string,
): BulkCreatedResourceResponseDto {
  return { success: true, ids, count: ids.length, message };
}
```

Create `src/shared/api/response-serialization.ts`:

```ts
import { ClassConstructor, plainToInstance } from 'class-transformer';

export interface PageResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export function toResponseDto<T, V>(
  dtoClass: ClassConstructor<T>,
  value: V,
): T {
  return plainToInstance(dtoClass, value, {
    excludeExtraneousValues: true,
  });
}

export function toResponseDtoList<T, V>(
  dtoClass: ClassConstructor<T>,
  values: V[],
): T[] {
  return values.map((value) => toResponseDto(dtoClass, value));
}

export function toPaginatedResponseDto<T, V>(
  dtoClass: ClassConstructor<T>,
  page: PageResult<V>,
): PageResult<T> {
  return {
    items: toResponseDtoList(dtoClass, page.items),
    total: page.total,
    page: page.page,
    pageSize: page.pageSize,
  };
}
```

- [ ] **Step 4: Run helper test to verify it passes**

Run:

```bash
cd commerce-core-service-nestjs
npm test -- response-serialization.spec.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/shared/api/mutation-response.dto.ts src/shared/api/response-serialization.ts src/shared/api/response-serialization.spec.ts
git commit -m "feat(core): add API response serialization helpers"
```

### Task 2: Add Safe Identity, Permission, And Ingestion Response DTOs

**Files:**
- Create: `commerce-core-service-nestjs/src/modules/users-permissions/dto/user-response.dto.ts`
- Create: `commerce-core-service-nestjs/src/modules/users-permissions/dto/permission-response.dto.ts`
- Create: `commerce-core-service-nestjs/src/modules/ingestion/dto/data-source-response.dto.ts`
- Create: `commerce-core-service-nestjs/src/modules/ingestion/dto/sync-run-response.dto.ts`
- Create: `commerce-core-service-nestjs/src/modules/ingestion/dto/raw-snapshot-response.dto.ts`
- Create: `commerce-core-service-nestjs/src/modules/ingestion/dto/import-run-response.dto.ts`

**Interfaces:**
- Consumes: entity properties from `User`, `Permission`, `DataSourceEntity`, `SyncRun`, and `RawSnapshot`.
- Produces: DTO classes with `@Expose()` on allowed outbound fields only.

- [ ] **Step 1: Create user and permission response DTOs**

Create `src/modules/users-permissions/dto/user-response.dto.ts`:

```ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserResponseDto {
  @Expose()
  @ApiProperty({ format: 'uuid' })
  id: string;

  @Expose()
  @ApiProperty()
  email: string;

  @Expose()
  @ApiProperty()
  displayName: string;

  @Expose()
  @ApiProperty()
  status: string;

  @Expose()
  @ApiProperty({ type: Date })
  createdAt: Date;

  @Expose()
  @ApiProperty({ type: Date })
  updatedAt: Date;
}
```

Create `src/modules/users-permissions/dto/permission-response.dto.ts`:

```ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class PermissionResponseDto {
  @Expose()
  @ApiProperty({ format: 'uuid' })
  id: string;

  @Expose()
  @ApiProperty()
  code: string;

  @Expose()
  @ApiProperty({ nullable: true, type: String })
  description: string | null;

  @Expose()
  @ApiProperty({ type: Date })
  createdAt: Date;
}
```

- [ ] **Step 2: Create ingestion response DTOs**

Create `src/modules/ingestion/dto/data-source-response.dto.ts` without `configJson`:

```ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class DataSourceResponseDto {
  @Expose()
  @ApiProperty({ format: 'uuid' })
  id: string;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  type: string;

  @Expose()
  @ApiProperty({ nullable: true, type: String })
  baseUrl: string | null;

  @Expose()
  @ApiProperty()
  status: string;

  @Expose()
  @ApiProperty({ type: Date })
  createdAt: Date;

  @Expose()
  @ApiProperty({ type: Date })
  updatedAt: Date;
}
```

Create `src/modules/ingestion/dto/sync-run-response.dto.ts`:

```ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class SyncRunResponseDto {
  @Expose()
  @ApiProperty({ format: 'uuid' })
  id: string;

  @Expose()
  @ApiProperty({ format: 'uuid' })
  dataSourceId: string;

  @Expose()
  @ApiProperty()
  status: string;

  @Expose()
  @ApiProperty({ nullable: true, type: Date })
  startedAt: Date | null;

  @Expose()
  @ApiProperty({ nullable: true, type: Date })
  finishedAt: Date | null;

  @Expose()
  @ApiProperty()
  totalRecords: number;

  @Expose()
  @ApiProperty()
  successCount: number;

  @Expose()
  @ApiProperty()
  failedCount: number;

  @Expose()
  @ApiProperty({ nullable: true, type: String })
  errorSummary: string | null;

  @Expose()
  @ApiProperty({ type: Date })
  createdAt: Date;
}
```

Create `src/modules/ingestion/dto/raw-snapshot-response.dto.ts` without `rawJson`:

```ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class RawSnapshotResponseDto {
  @Expose()
  @ApiProperty({ format: 'uuid' })
  id: string;

  @Expose()
  @ApiProperty({ format: 'uuid' })
  dataSourceId: string;

  @Expose()
  @ApiProperty({ nullable: true, format: 'uuid' })
  syncRunId: string | null;

  @Expose()
  @ApiProperty()
  contentType: string;

  @Expose()
  @ApiProperty({ nullable: true, type: String })
  contentHash: string | null;

  @Expose()
  @ApiProperty({ nullable: true, type: String })
  objectStorageKey: string | null;

  @Expose()
  @ApiProperty()
  parseStatus: string;

  @Expose()
  @ApiProperty({ nullable: true, type: String })
  errorMessage: string | null;

  @Expose()
  @ApiProperty({ type: Date })
  createdAt: Date;
}
```

Create `src/modules/ingestion/dto/import-run-response.dto.ts`:

```ts
import { ApiProperty } from '@nestjs/swagger';

export class ImportRunResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ format: 'uuid' })
  syncRunId: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  totalRecords: number;

  @ApiProperty()
  successCount: number;

  @ApiProperty()
  failedCount: number;

  @ApiProperty({ example: 'Import finished' })
  message: string;
}

export function toImportRunResponse(run: {
  id: string;
  status: string;
  totalRecords: number;
  successCount: number;
  failedCount: number;
}): ImportRunResponseDto {
  return {
    success: run.failedCount === 0,
    syncRunId: run.id,
    status: run.status,
    totalRecords: run.totalRecords,
    successCount: run.successCount,
    failedCount: run.failedCount,
    message:
      run.failedCount === 0
        ? 'Import finished successfully'
        : 'Import finished with errors',
  };
}
```

- [ ] **Step 3: Run TypeScript check**

Run:

```bash
cd commerce-core-service-nestjs
npm run build
```

Expected: build succeeds after the DTO files compile.

- [ ] **Step 4: Commit**

```bash
git add src/modules/users-permissions/dto src/modules/ingestion/dto
git commit -m "feat(core): add safe identity and ingestion response DTOs"
```

### Task 3: Add Catalog And Product Response DTOs

**Files:**
- Create: `commerce-core-service-nestjs/src/modules/categories/dto/category-response.dto.ts`
- Create: `commerce-core-service-nestjs/src/modules/categories/dto/category-attribute-response.dto.ts`
- Create: `commerce-core-service-nestjs/src/modules/products/dto/product-response.dto.ts`
- Modify: `commerce-core-service-nestjs/src/modules/products/dto/product-detail-response.dto.ts`
- Create: `commerce-core-service-nestjs/src/modules/products/dto/product-variant-response.dto.ts`
- Create: `commerce-core-service-nestjs/src/modules/products/dto/product-image-response.dto.ts`

**Interfaces:**
- Consumes: `Category`, `CategoryAttribute`, `Product`, `ProductVariant`, `ProductImage`.
- Produces: DTOs for list/detail GET responses with explicit outbound fields.

- [ ] **Step 1: Create category response DTOs**

Create `src/modules/categories/dto/category-response.dto.ts`:

```ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CategoryResponseDto {
  @Expose()
  @ApiProperty({ format: 'uuid' })
  id: string;

  @Expose()
  @ApiProperty({ nullable: true, format: 'uuid' })
  parentId: string | null;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  slug: string;

  @Expose()
  @ApiProperty()
  path: string;

  @Expose()
  @ApiProperty()
  level: number;

  @Expose()
  @ApiProperty()
  status: string;

  @Expose()
  @ApiProperty({ type: Date })
  createdAt: Date;

  @Expose()
  @ApiProperty({ type: Date })
  updatedAt: Date;
}
```

Create `src/modules/categories/dto/category-attribute-response.dto.ts`:

```ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CategoryAttributeResponseDto {
  @Expose()
  @ApiProperty({ format: 'uuid' })
  id: string;

  @Expose()
  @ApiProperty()
  code: string;

  @Expose()
  @ApiProperty()
  label: string;

  @Expose()
  @ApiProperty()
  dataType: string;

  @Expose()
  @ApiProperty()
  isFilterable: boolean;

  @Expose()
  @ApiProperty()
  isSearchable: boolean;

  @Expose()
  @ApiProperty()
  isRequired: boolean;

  @Expose()
  @ApiProperty({ nullable: true, type: String })
  unit: string | null;

  @Expose()
  @ApiProperty({ nullable: true, type: 'object', additionalProperties: true })
  optionsJson: Record<string, unknown> | null;

  @Expose()
  @ApiProperty({ type: Date })
  createdAt: Date;

  @Expose()
  @ApiProperty({ type: Date })
  updatedAt: Date;
}
```

- [ ] **Step 2: Create product response DTOs**

Create `src/modules/products/dto/product-variant-response.dto.ts`:

```ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ProductVariantResponseDto {
  @Expose()
  @ApiProperty({ format: 'uuid' })
  id: string;

  @Expose()
  @ApiProperty()
  sku: string;

  @Expose()
  @ApiProperty({ nullable: true, type: String })
  title: string | null;

  @Expose()
  @ApiProperty()
  price: string;

  @Expose()
  @ApiProperty()
  stockQuantity: number;

  @Expose()
  @ApiProperty()
  status: string;

  @Expose()
  @ApiProperty({ type: 'object', additionalProperties: true })
  specsJson: Record<string, unknown>;

  @Expose()
  @ApiProperty({ type: Date })
  createdAt: Date;

  @Expose()
  @ApiProperty({ type: Date })
  updatedAt: Date;
}
```

Create `src/modules/products/dto/product-image-response.dto.ts`:

```ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ProductImageResponseDto {
  @Expose()
  @ApiProperty({ format: 'uuid' })
  id: string;

  @Expose()
  @ApiProperty()
  url: string;

  @Expose()
  @ApiProperty({ nullable: true, type: String })
  altText: string | null;

  @Expose()
  @ApiProperty()
  sortOrder: number;

  @Expose()
  @ApiProperty({ type: Date })
  createdAt: Date;
}
```

Create `src/modules/products/dto/product-response.dto.ts`:

```ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ProductResponseDto {
  @Expose()
  @ApiProperty({ format: 'uuid' })
  id: string;

  @Expose()
  @ApiProperty({ format: 'uuid' })
  sellerId: string;

  @Expose()
  @ApiProperty({ format: 'uuid' })
  categoryId: string;

  @Expose()
  @ApiProperty()
  title: string;

  @Expose()
  @ApiProperty()
  slug: string;

  @Expose()
  @ApiProperty({ nullable: true, type: String })
  brand: string | null;

  @Expose()
  @ApiProperty()
  status: string;

  @Expose()
  @ApiProperty()
  priceMin: string;

  @Expose()
  @ApiProperty()
  priceMax: string;

  @Expose()
  @ApiProperty()
  ratingAvg: string;

  @Expose()
  @ApiProperty()
  reviewCount: number;

  @Expose()
  @ApiProperty({ type: Date })
  createdAt: Date;

  @Expose()
  @ApiProperty({ type: Date })
  updatedAt: Date;
}
```

Modify `src/modules/products/dto/product-detail-response.dto.ts` so it extends the list DTO and exposes description, specs, variants, and images:

```ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ProductImageResponseDto } from './product-image-response.dto';
import { ProductResponseDto } from './product-response.dto';
import { ProductVariantResponseDto } from './product-variant-response.dto';

export class ProductDetailResponseDto extends ProductResponseDto {
  @Expose()
  @ApiProperty({ nullable: true, type: String })
  description: string | null;

  @Expose()
  @ApiProperty({ type: 'object', additionalProperties: true })
  specsJson: Record<string, unknown>;

  @Expose()
  @Type(() => ProductVariantResponseDto)
  @ApiProperty({ type: [ProductVariantResponseDto] })
  variants: ProductVariantResponseDto[];

  @Expose()
  @Type(() => ProductImageResponseDto)
  @ApiProperty({ type: [ProductImageResponseDto] })
  images: ProductImageResponseDto[];
}
```

- [ ] **Step 3: Run TypeScript check**

Run:

```bash
cd commerce-core-service-nestjs
npm run build
```

Expected: build succeeds after DTO imports compile.

- [ ] **Step 4: Commit**

```bash
git add src/modules/categories/dto src/modules/products/dto
git commit -m "feat(core): add catalog and product response DTOs"
```

### Task 4: Add Marketplace Response DTOs

**Files:**
- Create: `commerce-core-service-nestjs/src/modules/sellers/dto/seller-response.dto.ts`
- Create: `commerce-core-service-nestjs/src/modules/buyers/dto/buyer-response.dto.ts`
- Create: `commerce-core-service-nestjs/src/modules/reviews/dto/review-response.dto.ts`
- Create: `commerce-core-service-nestjs/src/modules/orders/dto/order-item-response.dto.ts`
- Create: `commerce-core-service-nestjs/src/modules/orders/dto/order-response.dto.ts`

**Interfaces:**
- Consumes: `Seller`, `Buyer`, `Review`, `Order`, `OrderItem`.
- Produces: DTOs that keep GET responses useful for CMS screens while avoiding raw entity leakage.

- [ ] **Step 1: Create seller and buyer response DTOs**

Create `src/modules/sellers/dto/seller-response.dto.ts`:

```ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class SellerResponseDto {
  @Expose()
  @ApiProperty({ format: 'uuid' })
  id: string;

  @Expose()
  @ApiProperty({ nullable: true, format: 'uuid' })
  userId: string | null;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  slug: string;

  @Expose()
  @ApiProperty()
  status: string;

  @Expose()
  @ApiProperty({ type: 'object', additionalProperties: true })
  metadataJson: Record<string, unknown>;

  @Expose()
  @ApiProperty({ type: Date })
  createdAt: Date;

  @Expose()
  @ApiProperty({ type: Date })
  updatedAt: Date;
}

export class SellerDetailResponseDto extends SellerResponseDto {}
```

Create `src/modules/buyers/dto/buyer-response.dto.ts`:

```ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class BuyerResponseDto {
  @Expose()
  @ApiProperty({ format: 'uuid' })
  id: string;

  @Expose()
  @ApiProperty({ nullable: true, format: 'uuid' })
  userId: string | null;

  @Expose()
  @ApiProperty()
  email: string;

  @Expose()
  @ApiProperty()
  displayName: string;

  @Expose()
  @ApiProperty({ nullable: true, type: String })
  phone: string | null;

  @Expose()
  @ApiProperty()
  status: string;

  @Expose()
  @ApiProperty({ type: 'object', additionalProperties: true })
  metadataJson: Record<string, unknown>;

  @Expose()
  @ApiProperty({ type: Date })
  createdAt: Date;

  @Expose()
  @ApiProperty({ type: Date })
  updatedAt: Date;
}

export class BuyerDetailResponseDto extends BuyerResponseDto {}
```

- [ ] **Step 2: Create review and order response DTOs**

Create `src/modules/reviews/dto/review-response.dto.ts`:

```ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ReviewResponseDto {
  @Expose()
  @ApiProperty({ format: 'uuid' })
  id: string;

  @Expose()
  @ApiProperty({ format: 'uuid' })
  productId: string;

  @Expose()
  @ApiProperty({ nullable: true, format: 'uuid' })
  buyerId: string | null;

  @Expose()
  @ApiProperty({ nullable: true, format: 'uuid' })
  sellerId: string | null;

  @Expose()
  @ApiProperty()
  rating: number;

  @Expose()
  @ApiProperty({ nullable: true, type: String })
  title: string | null;

  @Expose()
  @ApiProperty({ nullable: true, type: String })
  content: string | null;

  @Expose()
  @ApiProperty()
  status: string;

  @Expose()
  @ApiProperty()
  sourceType: string;

  @Expose()
  @ApiProperty({ nullable: true, format: 'uuid' })
  sourceReviewId: string | null;

  @Expose()
  @ApiProperty({ type: Date })
  createdAt: Date;

  @Expose()
  @ApiProperty({ type: Date })
  updatedAt: Date;
}
```

Create `src/modules/orders/dto/order-item-response.dto.ts`:

```ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class OrderItemResponseDto {
  @Expose()
  @ApiProperty({ format: 'uuid' })
  id: string;

  @Expose()
  @ApiProperty({ format: 'uuid' })
  productId: string;

  @Expose()
  @ApiProperty({ nullable: true, format: 'uuid' })
  variantId: string | null;

  @Expose()
  @ApiProperty()
  quantity: number;

  @Expose()
  @ApiProperty()
  unitPrice: string;

  @Expose()
  @ApiProperty()
  totalPrice: string;

  @Expose()
  @ApiProperty({ type: Date })
  createdAt: Date;
}
```

Create `src/modules/orders/dto/order-response.dto.ts`:

```ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { OrderItemResponseDto } from './order-item-response.dto';

export class OrderResponseDto {
  @Expose()
  @ApiProperty({ format: 'uuid' })
  id: string;

  @Expose()
  @ApiProperty({ format: 'uuid' })
  buyerId: string;

  @Expose()
  @ApiProperty({ format: 'uuid' })
  sellerId: string;

  @Expose()
  @ApiProperty()
  status: string;

  @Expose()
  @ApiProperty()
  paymentStatus: string;

  @Expose()
  @ApiProperty()
  totalAmount: string;

  @Expose()
  @ApiProperty()
  currency: string;

  @Expose()
  @ApiProperty({ type: Date })
  orderedAt: Date;

  @Expose()
  @ApiProperty({ type: Date })
  createdAt: Date;

  @Expose()
  @ApiProperty({ type: Date })
  updatedAt: Date;
}

export class OrderDetailResponseDto extends OrderResponseDto {
  @Expose()
  @Type(() => OrderItemResponseDto)
  @ApiProperty({ type: [OrderItemResponseDto] })
  items: OrderItemResponseDto[];
}
```

- [ ] **Step 3: Run TypeScript check**

Run:

```bash
cd commerce-core-service-nestjs
npm run build
```

Expected: build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/modules/sellers/dto src/modules/buyers/dto src/modules/reviews/dto src/modules/orders/dto
git commit -m "feat(core): add marketplace response DTOs"
```

### Task 5: Convert Controllers To DTO Mapping And Lean Mutation Responses

**Files:**
- Modify: `commerce-core-service-nestjs/src/modules/categories/categories.controller.ts`
- Modify: `commerce-core-service-nestjs/src/modules/products/products.controller.ts`
- Modify: `commerce-core-service-nestjs/src/modules/sellers/sellers.controller.ts`
- Modify: `commerce-core-service-nestjs/src/modules/buyers/buyers.controller.ts`
- Modify: `commerce-core-service-nestjs/src/modules/reviews/reviews.controller.ts`
- Modify: `commerce-core-service-nestjs/src/modules/orders/orders.controller.ts`
- Modify: `commerce-core-service-nestjs/src/modules/ingestion/ingestion.controller.ts`
- Modify: `commerce-core-service-nestjs/src/modules/users-permissions/users-permissions.controller.ts`

**Interfaces:**
- Consumes: DTOs from Tasks 1-4 and existing service methods.
- Produces: controller methods that never return entities directly for public response bodies.

- [ ] **Step 1: Update category controller**

Apply this structure to `categories.controller.ts`:

```ts
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse } from '@nestjs/swagger';
import {
  CreatedResourceResponseDto,
  MutationSuccessResponseDto,
  createCreated,
  createSuccess,
} from '../../shared/api/mutation-response.dto';
import { toResponseDto, toResponseDtoList } from '../../shared/api/response-serialization';
import { CategoryAttributeResponseDto } from './dto/category-attribute-response.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
```

Change handlers to this return pattern:

```ts
@ApiOkResponse({ description: 'List of categories', type: [CategoryResponseDto] })
@Get()
async list(): Promise<CategoryResponseDto[]> {
  const categories = await this.categoriesService.list();
  return toResponseDtoList(CategoryResponseDto, categories);
}

@ApiCreatedResponse({ description: 'Created category', type: CreatedResourceResponseDto })
@Post()
async create(@Body() body: CreateCategoryDto): Promise<CreatedResourceResponseDto> {
  const category = await this.categoriesService.create(body);
  return createCreated(category.id, 'Category created successfully');
}

@ApiOkResponse({ description: 'Category details', type: CategoryResponseDto })
@Get(':id')
async get(@Param('id', ParseUUIDPipe) id: string): Promise<CategoryResponseDto> {
  const category = await this.categoriesService.get(id);
  return toResponseDto(CategoryResponseDto, category);
}

@ApiOkResponse({ description: 'Category updated successfully', type: MutationSuccessResponseDto })
@Patch(':id')
async update(
  @Param('id', ParseUUIDPipe) id: string,
  @Body() body: UpdateCategoryDto,
): Promise<MutationSuccessResponseDto> {
  await this.categoriesService.update(id, body);
  return createSuccess('Category updated successfully');
}

@ApiNoContentResponse({ description: 'Category deleted successfully' })
@HttpCode(HttpStatus.NO_CONTENT)
@Delete(':id')
async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
  await this.categoriesService.remove(id);
}
```

Use the same explicit pattern for attributes:

```ts
@ApiOkResponse({ description: 'List of category attributes', type: [CategoryAttributeResponseDto] })
@Get(':id/attributes')
async listAttributes(
  @Param('id', ParseUUIDPipe) id: string,
): Promise<CategoryAttributeResponseDto[]> {
  const attributes = await this.categoriesService.listAttributes(id);
  return toResponseDtoList(CategoryAttributeResponseDto, attributes);
}

@ApiCreatedResponse({ description: 'Created category attribute', type: CreatedResourceResponseDto })
@Post(':id/attributes')
async createAttribute(
  @Param('id', ParseUUIDPipe) id: string,
  @Body() body: CreateAttributeDto,
): Promise<CreatedResourceResponseDto> {
  const attribute = await this.categoriesService.createAttribute(id, body);
  return createCreated(attribute.id, 'Category attribute created successfully');
}

@ApiOkResponse({ description: 'Category attribute updated successfully', type: MutationSuccessResponseDto })
@Patch('attributes/:attributeId')
async updateAttribute(
  @Param('attributeId', ParseUUIDPipe) attributeId: string,
  @Body() body: UpdateAttributeDto,
): Promise<MutationSuccessResponseDto> {
  await this.categoriesService.updateAttribute(attributeId, body);
  return createSuccess('Category attribute updated successfully');
}

@ApiNoContentResponse({ description: 'Category attribute deleted successfully' })
@HttpCode(HttpStatus.NO_CONTENT)
@Delete('attributes/:attributeId')
async removeAttribute(
  @Param('attributeId', ParseUUIDPipe) attributeId: string,
): Promise<void> {
  await this.categoriesService.removeAttribute(attributeId);
}
```

- [ ] **Step 2: Update product controller**

Use these method mappings in `products.controller.ts`:

```ts
// GET list
const pageResult = await this.productsService.list({ search, categoryId, sellerId, status, page: page ? Number(page) : undefined, pageSize: pageSize ? Number(pageSize) : undefined });
return toPaginatedResponseDto(ProductResponseDto, pageResult);

// POST product
const product = await this.productsService.create(body);
return createCreated(product.id, 'Product created successfully');

// GET detail
const product = await this.productsService.getDetail(id);
return toResponseDto(ProductDetailResponseDto, product);

// PATCH product
await this.productsService.update(id, body);
return createSuccess('Product updated successfully');

// DELETE product
@HttpCode(HttpStatus.NO_CONTENT)
await this.productsService.remove(id);

// GET variants
const variants = await this.productsService.listVariants(id);
return toResponseDtoList(ProductVariantResponseDto, variants);

// POST variant
const variant = await this.productsService.createVariant(id, body);
return createCreated(variant.id, 'Product variant created successfully');

// POST images
const images = await this.productsService.addImages(id, body.images);
return createBulkCreated(
  images.map((image) => image.id),
  'Product images added successfully',
);
```

Also update Swagger response types:

```ts
@ApiOkResponse({ description: 'Paginated list of products', type: () => PaginatedResponseDto<ProductResponseDto> })
@ApiCreatedResponse({ description: 'Created product', type: CreatedResourceResponseDto })
@ApiOkResponse({ description: 'Product updated successfully', type: MutationSuccessResponseDto })
@ApiNoContentResponse({ description: 'Product deleted successfully' })
```

- [ ] **Step 3: Update sellers, buyers, reviews, and orders controllers**

Use these exact mapping rules:

```txt
SellersController.list -> toPaginatedResponseDto(SellerResponseDto, result)
SellersController.create -> createCreated(seller.id, 'Seller created successfully')
SellersController.get -> toResponseDto(SellerDetailResponseDto, seller)
SellersController.update -> createSuccess('Seller updated successfully')

BuyersController.list -> toPaginatedResponseDto(BuyerResponseDto, result)
BuyersController.create -> createCreated(buyer.id, 'Buyer created successfully')
BuyersController.get -> toResponseDto(BuyerDetailResponseDto, buyer)
BuyersController.update -> createSuccess('Buyer updated successfully')

ReviewsController.list -> toPaginatedResponseDto(ReviewResponseDto, result)
ReviewsController.create -> createCreated(review.id, 'Review created successfully')
ReviewsController.get -> toResponseDto(ReviewResponseDto, review)
ReviewsController.update -> createSuccess('Review updated successfully')

OrdersController.list -> toPaginatedResponseDto(OrderResponseDto, result)
OrdersController.create -> createCreated(order.id, 'Order created successfully')
OrdersController.get -> toResponseDto(OrderDetailResponseDto, order)
```

Update Swagger response types so no mutation endpoint documents `Seller`, `Buyer`, `Review`, or `Order` as the response type.

- [ ] **Step 4: Update users-permissions controller**

Use these mappings:

```ts
// GET /cms/users
const users = await this.usersPermissionsService.listUsers();
return toResponseDtoList(UserResponseDto, users);

// POST /cms/users
const user = await this.usersPermissionsService.createUser(body);
return createCreated(user.id, 'User created successfully');

// GET /cms/permissions
const permissions = await this.usersPermissionsService.listPermissions();
return toResponseDtoList(PermissionResponseDto, permissions);

// PUT /cms/users/:id/permissions
await this.usersPermissionsService.setPermissions(id, body.codes);
return createSuccess('User permissions updated successfully');
```

Update Swagger decorators:

```ts
@ApiOkResponse({ description: 'List of users', type: [UserResponseDto] })
@ApiCreatedResponse({ description: 'Created user', type: CreatedResourceResponseDto })
@ApiOkResponse({ description: 'List of permissions', type: [PermissionResponseDto] })
@ApiOkResponse({ description: 'User permissions updated successfully', type: MutationSuccessResponseDto })
```

- [ ] **Step 5: Update ingestion controller**

Use these mappings:

```ts
// data sources
return toResponseDtoList(DataSourceResponseDto, await this.ingestionService.listDataSources());
const source = await this.ingestionService.createDataSource(body);
return createCreated(source.id, 'Data source created successfully');
return toResponseDto(DataSourceResponseDto, await this.ingestionService.getDataSource(id));
await this.ingestionService.updateDataSource(id, body);
return createSuccess('Data source updated successfully');

// sync runs
return toPaginatedResponseDto(SyncRunResponseDto, await this.ingestionService.listSyncRuns({ dataSourceId, page: page ? Number(page) : undefined, pageSize: pageSize ? Number(pageSize) : undefined }));
return toResponseDto(SyncRunResponseDto, await this.ingestionService.getSyncRun(id));

// raw snapshots, still without rawJson
return toPaginatedResponseDto(RawSnapshotResponseDto, await this.ingestionService.listRawSnapshots({ dataSourceId, syncRunId, page: page ? Number(page) : undefined, pageSize: pageSize ? Number(pageSize) : undefined }));
return toResponseDto(RawSnapshotResponseDto, await this.ingestionService.getRawSnapshot(id));

// imports
return toImportRunResponse(await this.ingestionService.importProducts(body));
return toImportRunResponse(await this.ingestionService.importReviews(body));
```

Update Swagger decorators so `DataSourceEntity`, `SyncRun`, and `RawSnapshot` are no longer public response types.

- [ ] **Step 6: Run build**

Run:

```bash
cd commerce-core-service-nestjs
npm run build
```

Expected: build succeeds.

- [ ] **Step 7: Commit**

```bash
git add src/modules src/shared/api
git commit -m "refactor(core): return DTOs and lean mutation responses"
```

### Task 6: Add Controller Response Shape Tests

**Files:**
- Create: `commerce-core-service-nestjs/src/modules/users-permissions/users-permissions.controller.spec.ts`
- Create: `commerce-core-service-nestjs/src/modules/products/products.controller.spec.ts`
- Create: `commerce-core-service-nestjs/src/modules/ingestion/ingestion.controller.spec.ts`
- Create: `commerce-core-service-nestjs/src/modules/categories/categories.controller.spec.ts`
- Create: `commerce-core-service-nestjs/src/modules/sellers/sellers.controller.spec.ts`
- Create: `commerce-core-service-nestjs/src/modules/buyers/buyers.controller.spec.ts`
- Create: `commerce-core-service-nestjs/src/modules/reviews/reviews.controller.spec.ts`
- Create: `commerce-core-service-nestjs/src/modules/orders/orders.controller.spec.ts`

**Interfaces:**
- Consumes: controller classes and mocked service objects.
- Produces: tests that fail if mutation handlers return full payloads or safe GET handlers leak restricted fields.

- [ ] **Step 1: Add high-risk users-permissions controller tests**

Create `src/modules/users-permissions/users-permissions.controller.spec.ts`:

```ts
import { Test } from '@nestjs/testing';
import { UsersPermissionsController } from './users-permissions.controller';
import { UsersPermissionsService } from './users-permissions.service';

describe('UsersPermissionsController response shape', () => {
  let controller: UsersPermissionsController;
  const usersPermissionsService = {
    listUsers: jest.fn(),
    createUser: jest.fn(),
    listPermissions: jest.fn(),
    getUserPermissions: jest.fn(),
    setPermissions: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersPermissionsController],
      providers: [
        { provide: UsersPermissionsService, useValue: usersPermissionsService },
      ],
    }).compile();
    controller = moduleRef.get(UsersPermissionsController);
  });

  it('does not expose passwordHash when creating a user', async () => {
    usersPermissionsService.createUser.mockResolvedValue({
      id: 'user-1',
      email: 'admin@example.com',
      displayName: 'Admin',
      passwordHash: 'hash',
      status: 'ACTIVE',
    });

    await expect(
      controller.createUser({
        email: 'admin@example.com',
        password: 'Password123!',
        displayName: 'Admin',
        permissionCodes: [],
      }),
    ).resolves.toEqual({
      success: true,
      id: 'user-1',
      message: 'User created successfully',
    });
  });

  it('does not expose passwordHash in user list', async () => {
    usersPermissionsService.listUsers.mockResolvedValue([
      {
        id: 'user-1',
        email: 'admin@example.com',
        displayName: 'Admin',
        passwordHash: 'hash',
        status: 'ACTIVE',
        createdAt: new Date('2026-08-06T00:00:00.000Z'),
        updatedAt: new Date('2026-08-06T00:00:00.000Z'),
      },
    ]);

    const result = await controller.listUsers();

    expect(result).toEqual([
      {
        id: 'user-1',
        email: 'admin@example.com',
        displayName: 'Admin',
        status: 'ACTIVE',
        createdAt: new Date('2026-08-06T00:00:00.000Z'),
        updatedAt: new Date('2026-08-06T00:00:00.000Z'),
      },
    ]);
    expect('passwordHash' in result[0]).toBe(false);
  });

  it('returns a success acknowledgement after setting permissions', async () => {
    usersPermissionsService.setPermissions.mockResolvedValue(undefined);

    await expect(
      controller.setPermissions('00000000-0000-0000-0000-000000000001', {
        codes: ['product:read'],
      }),
    ).resolves.toEqual({
      success: true,
      message: 'User permissions updated successfully',
    });
  });
});
```

- [ ] **Step 2: Add high-risk ingestion controller tests**

Create `src/modules/ingestion/ingestion.controller.spec.ts` with these assertions:

```ts
it('does not expose configJson in data source list', async () => {
  ingestionService.listDataSources.mockResolvedValue([
    {
      id: 'source-1',
      name: 'Crawler',
      type: 'crawler',
      baseUrl: 'https://example.com',
      status: 'ACTIVE',
      configJson: { apiKey: 'secret' },
      createdAt: new Date('2026-08-06T00:00:00.000Z'),
      updatedAt: new Date('2026-08-06T00:00:00.000Z'),
    },
  ]);

  const result = await controller.listDataSources();
  expect('configJson' in result[0]).toBe(false);
});

it('does not expose rawJson in raw snapshot detail', async () => {
  ingestionService.getRawSnapshot.mockResolvedValue({
    id: 'snapshot-1',
    dataSourceId: 'source-1',
    syncRunId: 'run-1',
    contentType: 'application/json',
    contentHash: 'abc',
    rawJson: { payload: 'large-sensitive-content' },
    objectStorageKey: null,
    parseStatus: 'PARSED',
    errorMessage: null,
    createdAt: new Date('2026-08-06T00:00:00.000Z'),
  });

  const result = await controller.getRawSnapshot(
    '00000000-0000-0000-0000-000000000001',
  );
  expect('rawJson' in result).toBe(false);
});

it('returns compact import run response', async () => {
  ingestionService.importProducts.mockResolvedValue({
    id: 'run-1',
    status: 'COMPLETED',
    totalRecords: 2,
    successCount: 2,
    failedCount: 0,
  });

  await expect(
    controller.importProducts({ dataSourceId: 'source-1', items: [] }),
  ).resolves.toEqual({
    success: true,
    syncRunId: 'run-1',
    status: 'COMPLETED',
    totalRecords: 2,
    successCount: 2,
    failedCount: 0,
    message: 'Import finished successfully',
  });
});
```

Include the same `Test.createTestingModule` mock setup pattern as the users-permissions test.

- [ ] **Step 3: Add marketplace and catalog controller tests**

For each controller, add at least these assertions:

```txt
CategoriesController.create -> { success, id, message }; no category name/slug in body.
CategoriesController.update -> { success, message }; no updated entity fields.
ProductsController.create -> { success, id, message }; no title/specsJson in body.
ProductsController.update -> { success, message }; no product entity fields.
ProductsController.addImages -> { success, ids, count, message }; no image url/altText in body.
SellersController.create -> { success, id, message }; no metadataJson in mutation body.
BuyersController.create -> { success, id, message }; no metadataJson in mutation body.
ReviewsController.update -> { success, message }; no review content in mutation body.
OrdersController.create -> { success, id, message }; no order items in mutation body.
```

Use mocked service return values that include extra fields to prove the controller strips or ignores them.

- [ ] **Step 4: Run targeted tests**

Run:

```bash
cd commerce-core-service-nestjs
npm test -- users-permissions.controller.spec.ts ingestion.controller.spec.ts products.controller.spec.ts categories.controller.spec.ts sellers.controller.spec.ts buyers.controller.spec.ts reviews.controller.spec.ts orders.controller.spec.ts
```

Expected: PASS.

- [ ] **Step 5: Run full unit test suite and build**

Run:

```bash
cd commerce-core-service-nestjs
npm test
npm run build
```

Expected: both commands pass.

- [ ] **Step 6: Commit**

```bash
git add src/modules
git commit -m "test(core): cover CMS API response contracts"
```

### Task 7: Audit Swagger And Frontend Compatibility

**Files:**
- Modify: `commerce-core-service-nestjs/README.md`
- Inspect: `commerce-admin/src/modules/**/*.api.ts`
- Inspect: `commerce-admin/src/shared/api/mock-adapter.ts`

**Interfaces:**
- Consumes: final controller response decorators and existing frontend API wrappers.
- Produces: documented response policy and a compatibility note for any frontend follow-up work.

- [ ] **Step 1: Check Swagger decorators no longer expose entity response types for mutation endpoints**

Run:

```bash
cd /Users/binner99/Works/Okz/ai-commerce-marketplace-platform
rg -n "ApiCreatedResponse\\(\\{ description: 'Created|ApiOkResponse\\(\\{ description: 'Updated|type: (Category|Product|Seller|Buyer|Review|Order|DataSourceEntity|SyncRun|RawSnapshot|User)" commerce-core-service-nestjs/src/modules
```

Expected: no mutation endpoint documents a TypeORM entity class as its response type.

- [ ] **Step 2: Check frontend does not depend on full mutation payloads**

Run:

```bash
cd /Users/binner99/Works/Okz/ai-commerce-marketplace-platform
rg -n "\\.(post|patch|put|delete)<|coreApi\\.(post|patch|put|delete)|await .*\\.(create|update|remove|delete)" commerce-admin/src
```

Expected: identify whether the admin UI reads mutation response bodies. If it does, record exact files and add a separate frontend adaptation task before merging backend changes.

- [ ] **Step 3: Update backend README response policy**

Add this section to `commerce-core-service-nestjs/README.md`:

```md
## CMS API Response Policy

- GET endpoints return explicit response DTOs, not TypeORM entities.
- POST create endpoints return `201 Created` with `{ "success": true, "id": "...", "message": "..." }`.
- PATCH and PUT endpoints return `200 OK` with `{ "success": true, "message": "..." }`.
- DELETE endpoints return `204 No Content`.
- Import endpoints return a compact sync run summary with `syncRunId`, `status`, `totalRecords`, `successCount`, and `failedCount`.
- Sensitive or heavy persistence fields such as `passwordHash`, `configJson`, and `rawJson` are not returned from CMS API responses by default.
```

- [ ] **Step 4: Run final verification**

Run:

```bash
cd commerce-core-service-nestjs
npm test
npm run build
```

Expected: both commands pass.

- [ ] **Step 5: Commit**

```bash
git add README.md
git commit -m "docs(core): document CMS API response policy"
```

## Self-Review Checklist

- [ ] Spec coverage: every issue from the API response review maps to a task above.
- [ ] Placeholder scan: no banned placeholder wording remains in the actionable task steps.
- [ ] Type consistency: all helper names used by controller tasks are defined in Task 1 or DTO tasks.
- [ ] Safety check: user creation, data source config, and raw snapshot responses have explicit tests proving sensitive/heavy fields are not returned.
- [ ] Verification check: every implementation task has at least one concrete command with expected output.

## Execution Handoff

Plan complete and saved to `commerce-core-service-nestjs/docs/2026-08-06-api-response-contract-cleanup-plan.md`.

Two execution options:

1. **Subagent-Driven (recommended)** - Dispatch a fresh subagent per task, review between tasks, fast iteration.
2. **Inline Execution** - Execute tasks in this session using `superpowers:executing-plans`, batch execution with checkpoints.

Choose one before implementing. Do not start implementation from this plan without running the tests described in each task.
