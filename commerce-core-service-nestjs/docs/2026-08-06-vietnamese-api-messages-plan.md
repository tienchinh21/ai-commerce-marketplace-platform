# Vietnamese API Messages Implementation Plan

> **Status:** Implemented baseline / historical. Current source uses `src/shared/api/api-messages.vi.ts`, `ApiErrorCode`, `ApiExceptionFilter`, and CMS controller files named `cms-*.controller.ts`. Do not execute old file paths or class names from this plan without translating them to the current source structure.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update every CMS API success message, validation message, and error response to use clear Vietnamese text with specific machine-readable error codes.

**Architecture:** Centralize user-facing Vietnamese messages in one shared module, then make controllers and services consume those constants instead of hard-coded English strings. Add a global exception filter to normalize all HTTP, validation, database, and unexpected errors into one response shape. Configure `ValidationPipe.exceptionFactory` so DTO/class-validator failures return Vietnamese field-level details.

**Tech Stack:** NestJS 11, TypeScript 5.7, TypeORM, class-validator, @nestjs/swagger, Jest, @nestjs/testing.

## Global Constraints

- Keep all existing route paths under `/api/cms/*`; do not change service boundaries or permissions.
- Do not change database schemas, entity table/column mappings, DTO input validation rules, auth token shape, or response DTO data fields.
- All response `message` values returned to clients must be Vietnamese.
- All Swagger response `description` text for CMS endpoints should be Vietnamese.
- Error responses must be specific enough for the CMS to show user-friendly feedback and must include a stable `code`.
- Do not leak stack traces, SQL text, database constraint names, password hashes, tokens, or raw import payloads in error responses.
- Preserve HTTP status codes: `400` validation, `401` auth, `403` permission, `404` not found, `409` conflict, `500` unexpected server error.
- Keep existing success response shape from the API response contract plan: create `{ success: true, id, message }`, update `{ success: true, message }`, bulk create `{ success: true, ids, count, message }`, import `{ success: boolean, syncRunId, status, totalRecords, successCount, failedCount, message }`.

---

## Historical Problems This Plan Fixed

- Earlier controllers returned English success messages such as `Product created successfully`, `Category updated successfully`, and `Import finished with errors`.
- Earlier services threw English exceptions such as `Invalid credentials`, `User not found`, `Product not found`, and `Email already exists`.
- Earlier `ValidationPipe` used default Nest/class-validator English messages and default error shape.
- Earlier unhandled database errors could return generic or technical messages instead of a Vietnamese business message.
- Earlier Swagger `description` values were English for many endpoints, so generated API docs did not match the Vietnamese CMS contract.

## Target Error Response Shape

Every non-2xx JSON error response should follow this shape:

```json
{
  "success": false,
  "statusCode": 404,
  "code": "PRODUCT_NOT_FOUND",
  "message": "Không tìm thấy sản phẩm.",
  "details": [],
  "timestamp": "2026-08-06T00:00:00.000Z",
  "path": "/api/cms/products/00000000-0000-0000-0000-000000000001",
  "method": "GET"
}
```

Validation errors should include field-level details:

```json
{
  "success": false,
  "statusCode": 400,
  "code": "VALIDATION_FAILED",
  "message": "Dữ liệu gửi lên không hợp lệ.",
  "details": [
    {
      "field": "email",
      "message": "Email không hợp lệ."
    },
    {
      "field": "password",
      "message": "Mật khẩu phải có ít nhất 8 ký tự."
    }
  ],
  "timestamp": "2026-08-06T00:00:00.000Z",
  "path": "/api/cms/users",
  "method": "POST"
}
```

## Vietnamese Message Catalog

Use these exact client-facing messages unless the business owner requests wording changes later:

```txt
AUTH_INVALID_CREDENTIALS -> Email hoặc mật khẩu không đúng.
AUTH_USER_NOT_FOUND -> Không tìm thấy người dùng đăng nhập.
AUTH_UNAUTHORIZED -> Bạn cần đăng nhập để thực hiện thao tác này.
AUTH_FORBIDDEN -> Bạn không có quyền thực hiện thao tác này.

USER_NOT_FOUND -> Không tìm thấy người dùng.
USER_EMAIL_EXISTS -> Email đã tồn tại.
USER_CREATED -> Tạo người dùng thành công.
USER_PERMISSIONS_UPDATED -> Cập nhật quyền người dùng thành công.

CATEGORY_NOT_FOUND -> Không tìm thấy danh mục.
CATEGORY_ATTRIBUTE_NOT_FOUND -> Không tìm thấy thuộc tính danh mục.
CATEGORY_CREATED -> Tạo danh mục thành công.
CATEGORY_UPDATED -> Cập nhật danh mục thành công.
CATEGORY_DELETED -> Xóa danh mục thành công.
CATEGORY_ATTRIBUTE_CREATED -> Tạo thuộc tính danh mục thành công.
CATEGORY_ATTRIBUTE_UPDATED -> Cập nhật thuộc tính danh mục thành công.
CATEGORY_ATTRIBUTE_DELETED -> Xóa thuộc tính danh mục thành công.

PRODUCT_NOT_FOUND -> Không tìm thấy sản phẩm.
PRODUCT_CREATED -> Tạo sản phẩm thành công.
PRODUCT_UPDATED -> Cập nhật sản phẩm thành công.
PRODUCT_DELETED -> Xóa sản phẩm thành công.
PRODUCT_VARIANT_CREATED -> Tạo biến thể sản phẩm thành công.
PRODUCT_IMAGES_ADDED -> Thêm hình ảnh sản phẩm thành công.

SELLER_NOT_FOUND -> Không tìm thấy nhà bán hàng.
SELLER_CREATED -> Tạo nhà bán hàng thành công.
SELLER_UPDATED -> Cập nhật nhà bán hàng thành công.

BUYER_NOT_FOUND -> Không tìm thấy người mua.
BUYER_CREATED -> Tạo người mua thành công.
BUYER_UPDATED -> Cập nhật người mua thành công.

REVIEW_NOT_FOUND -> Không tìm thấy đánh giá.
REVIEW_CREATED -> Tạo đánh giá thành công.
REVIEW_UPDATED -> Cập nhật đánh giá thành công.

ORDER_NOT_FOUND -> Không tìm thấy đơn hàng.
ORDER_CREATED -> Tạo đơn hàng thành công.

DATA_SOURCE_NOT_FOUND -> Không tìm thấy nguồn dữ liệu.
DATA_SOURCE_CREATED -> Tạo nguồn dữ liệu thành công.
DATA_SOURCE_UPDATED -> Cập nhật nguồn dữ liệu thành công.
SYNC_RUN_NOT_FOUND -> Không tìm thấy lượt đồng bộ.
RAW_SNAPSHOT_NOT_FOUND -> Không tìm thấy bản ghi dữ liệu thô.
IMPORT_PRODUCTS_COMPLETED -> Nhập sản phẩm hoàn tất.
IMPORT_PRODUCTS_COMPLETED_WITH_ERRORS -> Nhập sản phẩm hoàn tất nhưng có lỗi.
IMPORT_REVIEWS_COMPLETED -> Nhập đánh giá hoàn tất.
IMPORT_REVIEWS_COMPLETED_WITH_ERRORS -> Nhập đánh giá hoàn tất nhưng có lỗi.

VALIDATION_FAILED -> Dữ liệu gửi lên không hợp lệ.
INVALID_UUID -> Mã định danh không hợp lệ.
DATABASE_CONFLICT -> Dữ liệu đã tồn tại hoặc bị trùng.
DATABASE_RELATION_NOT_FOUND -> Dữ liệu liên quan không tồn tại.
DATABASE_REQUIRED_FIELD_MISSING -> Thiếu dữ liệu bắt buộc.
INTERNAL_SERVER_ERROR -> Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.
```

## File Structure

- Create: `commerce-core-service-nestjs/src/shared/api/api-error-code.ts`
  - Stable error code enum used by services, filters, and tests.
- Create: `commerce-core-service-nestjs/src/shared/api/api-messages.vi.ts`
  - Vietnamese success and error message constants.
- Create: `commerce-core-service-nestjs/src/shared/api/api-error-response.dto.ts`
  - Swagger/runtime DTO for normalized errors.
- Create: `commerce-core-service-nestjs/src/shared/api/api-exception.filter.ts`
  - Global exception filter for HTTP exceptions, database errors, and unexpected errors.
- Create: `commerce-core-service-nestjs/src/shared/api/validation-error.util.ts`
  - Converts class-validator errors into Vietnamese field-level details.
- Create: `commerce-core-service-nestjs/src/shared/api/api-exception.filter.spec.ts`
  - Unit tests for error response normalization.
- Create: `commerce-core-service-nestjs/src/shared/api/validation-error.util.spec.ts`
  - Unit tests for Vietnamese validation details.
- Modify: `commerce-core-service-nestjs/src/main.ts`
  - Register `ApiExceptionFilter` globally and add Vietnamese `ValidationPipe.exceptionFactory`.
- Modify: `commerce-core-service-nestjs/src/shared/api/mutation-response.dto.ts`
  - Keep response shape unchanged; use Vietnamese `ApiProperty` examples.
- Modify: `commerce-core-service-nestjs/src/modules/**/**.controller.ts`
  - Replace English success messages and Swagger descriptions with Vietnamese constants/text.
- Modify: `commerce-core-service-nestjs/src/modules/**/**.service.ts`
  - Replace English exception messages with Vietnamese coded exception objects.
- Modify: `commerce-core-service-nestjs/src/modules/ingestion/dto/import-run-response.dto.ts`
  - Return Vietnamese import completion messages.
- Modify: `commerce-core-service-nestjs/src/modules/**/*.spec.ts`
  - Update tests to assert Vietnamese messages and normalized errors.
- Modify: `commerce-core-service-nestjs/README.md`
  - Document Vietnamese API message/error response policy.

## Implementation Tasks

### Task 1: Add Vietnamese Message And Error Code Foundation

**Files:**
- Create: `commerce-core-service-nestjs/src/shared/api/api-error-code.ts`
- Create: `commerce-core-service-nestjs/src/shared/api/api-messages.vi.ts`
- Create: `commerce-core-service-nestjs/src/shared/api/api-error-response.dto.ts`
- Modify: `commerce-core-service-nestjs/src/shared/api/mutation-response.dto.ts`

**Interfaces:**
- Consumes: existing shared response DTO folder.
- Produces:
  - `ApiErrorCode` enum.
  - `VI_API_MESSAGES` constant.
  - `ApiErrorResponseDto`, `ApiErrorDetailDto`.
  - Vietnamese Swagger examples for mutation response DTOs.

- [ ] **Step 1: Write the message catalog**

Create `src/shared/api/api-error-code.ts`:

```ts
export enum ApiErrorCode {
  AUTH_INVALID_CREDENTIALS = 'AUTH_INVALID_CREDENTIALS',
  AUTH_USER_NOT_FOUND = 'AUTH_USER_NOT_FOUND',
  AUTH_UNAUTHORIZED = 'AUTH_UNAUTHORIZED',
  AUTH_FORBIDDEN = 'AUTH_FORBIDDEN',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  USER_EMAIL_EXISTS = 'USER_EMAIL_EXISTS',
  CATEGORY_NOT_FOUND = 'CATEGORY_NOT_FOUND',
  CATEGORY_ATTRIBUTE_NOT_FOUND = 'CATEGORY_ATTRIBUTE_NOT_FOUND',
  PRODUCT_NOT_FOUND = 'PRODUCT_NOT_FOUND',
  SELLER_NOT_FOUND = 'SELLER_NOT_FOUND',
  BUYER_NOT_FOUND = 'BUYER_NOT_FOUND',
  REVIEW_NOT_FOUND = 'REVIEW_NOT_FOUND',
  ORDER_NOT_FOUND = 'ORDER_NOT_FOUND',
  DATA_SOURCE_NOT_FOUND = 'DATA_SOURCE_NOT_FOUND',
  SYNC_RUN_NOT_FOUND = 'SYNC_RUN_NOT_FOUND',
  RAW_SNAPSHOT_NOT_FOUND = 'RAW_SNAPSHOT_NOT_FOUND',
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  INVALID_UUID = 'INVALID_UUID',
  DATABASE_CONFLICT = 'DATABASE_CONFLICT',
  DATABASE_RELATION_NOT_FOUND = 'DATABASE_RELATION_NOT_FOUND',
  DATABASE_REQUIRED_FIELD_MISSING = 'DATABASE_REQUIRED_FIELD_MISSING',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
}
```

Create `src/shared/api/api-messages.vi.ts`:

```ts
import { ApiErrorCode } from './api-error-code';

export const VI_API_MESSAGES = {
  errors: {
    [ApiErrorCode.AUTH_INVALID_CREDENTIALS]: 'Email hoặc mật khẩu không đúng.',
    [ApiErrorCode.AUTH_USER_NOT_FOUND]: 'Không tìm thấy người dùng đăng nhập.',
    [ApiErrorCode.AUTH_UNAUTHORIZED]: 'Bạn cần đăng nhập để thực hiện thao tác này.',
    [ApiErrorCode.AUTH_FORBIDDEN]: 'Bạn không có quyền thực hiện thao tác này.',
    [ApiErrorCode.USER_NOT_FOUND]: 'Không tìm thấy người dùng.',
    [ApiErrorCode.USER_EMAIL_EXISTS]: 'Email đã tồn tại.',
    [ApiErrorCode.CATEGORY_NOT_FOUND]: 'Không tìm thấy danh mục.',
    [ApiErrorCode.CATEGORY_ATTRIBUTE_NOT_FOUND]: 'Không tìm thấy thuộc tính danh mục.',
    [ApiErrorCode.PRODUCT_NOT_FOUND]: 'Không tìm thấy sản phẩm.',
    [ApiErrorCode.SELLER_NOT_FOUND]: 'Không tìm thấy nhà bán hàng.',
    [ApiErrorCode.BUYER_NOT_FOUND]: 'Không tìm thấy người mua.',
    [ApiErrorCode.REVIEW_NOT_FOUND]: 'Không tìm thấy đánh giá.',
    [ApiErrorCode.ORDER_NOT_FOUND]: 'Không tìm thấy đơn hàng.',
    [ApiErrorCode.DATA_SOURCE_NOT_FOUND]: 'Không tìm thấy nguồn dữ liệu.',
    [ApiErrorCode.SYNC_RUN_NOT_FOUND]: 'Không tìm thấy lượt đồng bộ.',
    [ApiErrorCode.RAW_SNAPSHOT_NOT_FOUND]: 'Không tìm thấy bản ghi dữ liệu thô.',
    [ApiErrorCode.VALIDATION_FAILED]: 'Dữ liệu gửi lên không hợp lệ.',
    [ApiErrorCode.INVALID_UUID]: 'Mã định danh không hợp lệ.',
    [ApiErrorCode.DATABASE_CONFLICT]: 'Dữ liệu đã tồn tại hoặc bị trùng.',
    [ApiErrorCode.DATABASE_RELATION_NOT_FOUND]: 'Dữ liệu liên quan không tồn tại.',
    [ApiErrorCode.DATABASE_REQUIRED_FIELD_MISSING]: 'Thiếu dữ liệu bắt buộc.',
    [ApiErrorCode.INTERNAL_SERVER_ERROR]: 'Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.',
  },
  success: {
    USER_CREATED: 'Tạo người dùng thành công.',
    USER_PERMISSIONS_UPDATED: 'Cập nhật quyền người dùng thành công.',
    CATEGORY_CREATED: 'Tạo danh mục thành công.',
    CATEGORY_UPDATED: 'Cập nhật danh mục thành công.',
    CATEGORY_DELETED: 'Xóa danh mục thành công.',
    CATEGORY_ATTRIBUTE_CREATED: 'Tạo thuộc tính danh mục thành công.',
    CATEGORY_ATTRIBUTE_UPDATED: 'Cập nhật thuộc tính danh mục thành công.',
    CATEGORY_ATTRIBUTE_DELETED: 'Xóa thuộc tính danh mục thành công.',
    PRODUCT_CREATED: 'Tạo sản phẩm thành công.',
    PRODUCT_UPDATED: 'Cập nhật sản phẩm thành công.',
    PRODUCT_DELETED: 'Xóa sản phẩm thành công.',
    PRODUCT_VARIANT_CREATED: 'Tạo biến thể sản phẩm thành công.',
    PRODUCT_IMAGES_ADDED: 'Thêm hình ảnh sản phẩm thành công.',
    SELLER_CREATED: 'Tạo nhà bán hàng thành công.',
    SELLER_UPDATED: 'Cập nhật nhà bán hàng thành công.',
    BUYER_CREATED: 'Tạo người mua thành công.',
    BUYER_UPDATED: 'Cập nhật người mua thành công.',
    REVIEW_CREATED: 'Tạo đánh giá thành công.',
    REVIEW_UPDATED: 'Cập nhật đánh giá thành công.',
    ORDER_CREATED: 'Tạo đơn hàng thành công.',
    DATA_SOURCE_CREATED: 'Tạo nguồn dữ liệu thành công.',
    DATA_SOURCE_UPDATED: 'Cập nhật nguồn dữ liệu thành công.',
    IMPORT_PRODUCTS_COMPLETED: 'Nhập sản phẩm hoàn tất.',
    IMPORT_PRODUCTS_COMPLETED_WITH_ERRORS: 'Nhập sản phẩm hoàn tất nhưng có lỗi.',
    IMPORT_REVIEWS_COMPLETED: 'Nhập đánh giá hoàn tất.',
    IMPORT_REVIEWS_COMPLETED_WITH_ERRORS: 'Nhập đánh giá hoàn tất nhưng có lỗi.',
  },
} as const;
```

- [ ] **Step 2: Add normalized error response DTO**

Create `src/shared/api/api-error-response.dto.ts`:

```ts
import { ApiProperty } from '@nestjs/swagger';
import { ApiErrorCode } from './api-error-code';

export class ApiErrorDetailDto {
  @ApiProperty({ example: 'email' })
  field?: string;

  @ApiProperty({ example: 'Email không hợp lệ.' })
  message: string;
}

export class ApiErrorResponseDto {
  @ApiProperty({ example: false })
  success: false;

  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({ enum: ApiErrorCode, example: ApiErrorCode.VALIDATION_FAILED })
  code: ApiErrorCode | string;

  @ApiProperty({ example: 'Dữ liệu gửi lên không hợp lệ.' })
  message: string;

  @ApiProperty({ type: [ApiErrorDetailDto], required: false })
  details?: ApiErrorDetailDto[];

  @ApiProperty({ example: '2026-08-06T00:00:00.000Z' })
  timestamp: string;

  @ApiProperty({ example: '/api/cms/products' })
  path: string;

  @ApiProperty({ example: 'POST' })
  method: string;
}
```

- [ ] **Step 3: Update mutation response DTO examples only**

Modify `src/shared/api/mutation-response.dto.ts` examples:

```ts
export class MutationSuccessResponseDto {
  @ApiProperty({ example: true })
  success: true;

  @ApiProperty({ example: 'Cập nhật dữ liệu thành công.' })
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
```

Do not change `createSuccess`, `createCreated`, or `createBulkCreated` signatures.

- [ ] **Step 4: Run build**

Run:

```bash
cd commerce-core-service-nestjs
npm run build
```

Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/shared/api/api-error-code.ts src/shared/api/api-messages.vi.ts src/shared/api/api-error-response.dto.ts src/shared/api/mutation-response.dto.ts
git commit -m "feat(core): add Vietnamese API message catalog"
```

### Task 2: Add Vietnamese Validation Error Factory

**Files:**
- Create: `commerce-core-service-nestjs/src/shared/api/validation-error.util.ts`
- Create: `commerce-core-service-nestjs/src/shared/api/validation-error.util.spec.ts`
- Modify: `commerce-core-service-nestjs/src/main.ts`

**Interfaces:**
- Consumes: `ValidationError` from `class-validator`, `BadRequestException` and `ValidationPipe` from `@nestjs/common`.
- Produces:
  - `flattenValidationErrors(errors: ValidationError[]): ApiErrorDetailDto[]`
  - `createVietnameseValidationException(errors: ValidationError[]): BadRequestException`

- [ ] **Step 1: Write failing validation tests**

Create `src/shared/api/validation-error.util.spec.ts`:

```ts
import { BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import {
  createVietnameseValidationException,
  flattenValidationErrors,
} from './validation-error.util';
import { ApiErrorCode } from './api-error-code';
import { VI_API_MESSAGES } from './api-messages.vi';

describe('Vietnamese validation errors', () => {
  it('maps common class-validator constraints to Vietnamese messages', () => {
    const errors: ValidationError[] = [
      {
        property: 'email',
        constraints: { isEmail: 'email must be an email' },
      } as ValidationError,
      {
        property: 'password',
        constraints: { minLength: 'password must be longer than or equal to 8 characters' },
      } as ValidationError,
      {
        property: 'items',
        children: [
          {
            property: '0',
            children: [
              {
                property: 'productId',
                constraints: { isUuid: 'productId must be a UUID' },
              } as ValidationError,
            ],
          } as ValidationError,
        ],
      } as ValidationError,
    ];

    expect(flattenValidationErrors(errors)).toEqual([
      { field: 'email', message: 'Email không hợp lệ.' },
      { field: 'password', message: 'Mật khẩu không hợp lệ hoặc chưa đủ độ dài.' },
      { field: 'items.0.productId', message: 'Mã định danh không hợp lệ.' },
    ]);
  });

  it('creates a BadRequestException with normalized Vietnamese payload', () => {
    const exception = createVietnameseValidationException([
      {
        property: 'title',
        constraints: { isNotEmpty: 'title should not be empty' },
      } as ValidationError,
    ]);

    expect(exception).toBeInstanceOf(BadRequestException);
    expect(exception.getResponse()).toEqual({
      code: ApiErrorCode.VALIDATION_FAILED,
      message: VI_API_MESSAGES.errors[ApiErrorCode.VALIDATION_FAILED],
      details: [{ field: 'title', message: 'Trường này không được để trống.' }],
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
cd commerce-core-service-nestjs
npm test -- validation-error.util.spec.ts
```

Expected: FAIL because `validation-error.util.ts` does not exist yet.

- [ ] **Step 3: Implement validation helper**

Create `src/shared/api/validation-error.util.ts`:

```ts
import { BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { ApiErrorDetailDto } from './api-error-response.dto';
import { ApiErrorCode } from './api-error-code';
import { VI_API_MESSAGES } from './api-messages.vi';

const CONSTRAINT_MESSAGES: Record<string, string> = {
  isEmail: 'Email không hợp lệ.',
  isUuid: 'Mã định danh không hợp lệ.',
  isUUID: 'Mã định danh không hợp lệ.',
  isNotEmpty: 'Trường này không được để trống.',
  isString: 'Giá trị phải là chuỗi.',
  isNumber: 'Giá trị phải là số.',
  isInt: 'Giá trị phải là số nguyên.',
  isBoolean: 'Giá trị phải là đúng hoặc sai.',
  isArray: 'Giá trị phải là danh sách.',
  arrayMinSize: 'Danh sách phải có ít nhất một phần tử.',
  min: 'Giá trị nhỏ hơn mức tối thiểu cho phép.',
  max: 'Giá trị vượt quá mức tối đa cho phép.',
  minLength: 'Mật khẩu không hợp lệ hoặc chưa đủ độ dài.',
  maxLength: 'Giá trị vượt quá độ dài cho phép.',
  isOptional: 'Giá trị không hợp lệ.',
};

function messageForConstraint(name: string): string {
  return CONSTRAINT_MESSAGES[name] ?? 'Giá trị không hợp lệ.';
}

function walkValidationErrors(
  errors: ValidationError[],
  parentPath = '',
): ApiErrorDetailDto[] {
  return errors.flatMap((error) => {
    const field = parentPath ? `${parentPath}.${error.property}` : error.property;
    const ownErrors = Object.keys(error.constraints ?? {}).map((constraint) => ({
      field,
      message: messageForConstraint(constraint),
    }));
    const childErrors = error.children?.length
      ? walkValidationErrors(error.children, field)
      : [];
    return [...ownErrors, ...childErrors];
  });
}

export function flattenValidationErrors(
  errors: ValidationError[],
): ApiErrorDetailDto[] {
  return walkValidationErrors(errors);
}

export function createVietnameseValidationException(
  errors: ValidationError[],
): BadRequestException {
  return new BadRequestException({
    code: ApiErrorCode.VALIDATION_FAILED,
    message: VI_API_MESSAGES.errors[ApiErrorCode.VALIDATION_FAILED],
    details: flattenValidationErrors(errors),
  });
}
```

- [ ] **Step 4: Register the validation factory in main.ts**

Modify `src/main.ts`:

```ts
import { createVietnameseValidationException } from './shared/api/validation-error.util';
```

Update the global pipe:

```ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
    exceptionFactory: createVietnameseValidationException,
  }),
);
```

- [ ] **Step 5: Run validation helper test and build**

Run:

```bash
cd commerce-core-service-nestjs
npm test -- validation-error.util.spec.ts
npm run build
```

Expected: both commands pass.

- [ ] **Step 6: Commit**

```bash
git add src/shared/api/validation-error.util.ts src/shared/api/validation-error.util.spec.ts src/main.ts
git commit -m "feat(core): return Vietnamese validation errors"
```

### Task 3: Add Global Vietnamese Exception Filter

**Files:**
- Create: `commerce-core-service-nestjs/src/shared/api/api-exception.filter.ts`
- Create: `commerce-core-service-nestjs/src/shared/api/api-exception.filter.spec.ts`
- Modify: `commerce-core-service-nestjs/src/main.ts`

**Interfaces:**
- Consumes: `HttpException`, `QueryFailedError`, Express `Request`/`Response`.
- Produces: `ApiExceptionFilter` registered globally with `app.useGlobalFilters(new ApiExceptionFilter())`.

- [ ] **Step 1: Write failing filter tests**

Create `src/shared/api/api-exception.filter.spec.ts`:

```ts
import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ArgumentsHost } from '@nestjs/common';
import { ApiExceptionFilter } from './api-exception.filter';
import { ApiErrorCode } from './api-error-code';
import { VI_API_MESSAGES } from './api-messages.vi';

function createHost() {
  const json = jest.fn();
  const status = jest.fn().mockReturnValue({ json });
  const response = { status };
  const request = { url: '/api/cms/products/id', method: 'GET' };
  const host = {
    switchToHttp: () => ({
      getResponse: () => response,
      getRequest: () => request,
    }),
  } as ArgumentsHost;
  return { host, status, json };
}

describe('ApiExceptionFilter', () => {
  it('keeps Vietnamese coded HttpException payloads', () => {
    const { host, status, json } = createHost();
    const filter = new ApiExceptionFilter();

    filter.catch(
      new NotFoundException({
        code: ApiErrorCode.PRODUCT_NOT_FOUND,
        message: VI_API_MESSAGES.errors[ApiErrorCode.PRODUCT_NOT_FOUND],
      }),
      host,
    );

    expect(status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        statusCode: 404,
        code: ApiErrorCode.PRODUCT_NOT_FOUND,
        message: 'Không tìm thấy sản phẩm.',
        path: '/api/cms/products/id',
        method: 'GET',
      }),
    );
  });

  it('maps uncoded UnauthorizedException to Vietnamese auth message', () => {
    const { host, json } = createHost();
    const filter = new ApiExceptionFilter();

    filter.catch(new UnauthorizedException(), host);

    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 401,
        code: ApiErrorCode.AUTH_UNAUTHORIZED,
        message: 'Bạn cần đăng nhập để thực hiện thao tác này.',
      }),
    );
  });

  it('maps uncoded ForbiddenException to Vietnamese permission message', () => {
    const { host, json } = createHost();
    const filter = new ApiExceptionFilter();

    filter.catch(new ForbiddenException(), host);

    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 403,
        code: ApiErrorCode.AUTH_FORBIDDEN,
        message: 'Bạn không có quyền thực hiện thao tác này.',
      }),
    );
  });

  it('maps ParseUUIDPipe bad request errors to Vietnamese UUID message', () => {
    const { host, json } = createHost();
    const filter = new ApiExceptionFilter();

    filter.catch(new BadRequestException('Validation failed (uuid is expected)'), host);

    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        code: ApiErrorCode.INVALID_UUID,
        message: 'Mã định danh không hợp lệ.',
      }),
    );
  });

  it('maps Postgres unique constraint errors to Vietnamese conflict message', () => {
    const { host, json } = createHost();
    const filter = new ApiExceptionFilter();
    const error = { code: '23505' };

    filter.catch(error, host);

    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 409,
        code: ApiErrorCode.DATABASE_CONFLICT,
        message: 'Dữ liệu đã tồn tại hoặc bị trùng.',
      }),
    );
  });

  it('hides unexpected error details behind a Vietnamese system message', () => {
    const { host, json } = createHost();
    const filter = new ApiExceptionFilter();

    filter.catch(new Error('database password leaked'), host);

    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 500,
        code: ApiErrorCode.INTERNAL_SERVER_ERROR,
        message: 'Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.',
      }),
    );
    expect(JSON.stringify(json.mock.calls[0][0])).not.toContain('database password leaked');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
cd commerce-core-service-nestjs
npm test -- api-exception.filter.spec.ts
```

Expected: FAIL because `api-exception.filter.ts` does not exist yet.

- [ ] **Step 3: Implement the exception filter**

Create `src/shared/api/api-exception.filter.ts`:

```ts
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiErrorCode } from './api-error-code';
import { ApiErrorDetailDto, ApiErrorResponseDto } from './api-error-response.dto';
import { VI_API_MESSAGES } from './api-messages.vi';

interface CodedErrorBody {
  code?: ApiErrorCode | string;
  message?: string | string[];
  details?: ApiErrorDetailDto[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function getPgErrorCode(exception: unknown): string | undefined {
  return isRecord(exception) && typeof exception.code === 'string'
    ? exception.code
    : undefined;
}

function normalizeHttpException(exception: HttpException): {
  statusCode: number;
  code: ApiErrorCode | string;
  message: string;
  details?: ApiErrorDetailDto[];
} {
  const statusCode = exception.getStatus();
  const response = exception.getResponse();
  const body: CodedErrorBody = isRecord(response)
    ? (response as CodedErrorBody)
    : { message: String(response) };

  if (body.code && typeof body.message === 'string') {
    return {
      statusCode,
      code: body.code,
      message: body.message,
      details: body.details,
    };
  }

  if (exception instanceof UnauthorizedException) {
    return {
      statusCode,
      code: ApiErrorCode.AUTH_UNAUTHORIZED,
      message: VI_API_MESSAGES.errors[ApiErrorCode.AUTH_UNAUTHORIZED],
    };
  }

  if (exception instanceof ForbiddenException) {
    return {
      statusCode,
      code: ApiErrorCode.AUTH_FORBIDDEN,
      message: VI_API_MESSAGES.errors[ApiErrorCode.AUTH_FORBIDDEN],
    };
  }

  if (
    statusCode === HttpStatus.BAD_REQUEST &&
    typeof body.message === 'string' &&
    body.message.toLowerCase().includes('uuid')
  ) {
    return {
      statusCode,
      code: ApiErrorCode.INVALID_UUID,
      message: VI_API_MESSAGES.errors[ApiErrorCode.INVALID_UUID],
    };
  }

  if (statusCode === HttpStatus.CONFLICT) {
    return {
      statusCode,
      code: ApiErrorCode.DATABASE_CONFLICT,
      message: VI_API_MESSAGES.errors[ApiErrorCode.DATABASE_CONFLICT],
    };
  }

  return {
    statusCode,
    code: ApiErrorCode.INTERNAL_SERVER_ERROR,
    message:
      statusCode >= 500
        ? VI_API_MESSAGES.errors[ApiErrorCode.INTERNAL_SERVER_ERROR]
        : VI_API_MESSAGES.errors[ApiErrorCode.VALIDATION_FAILED],
  };
}

function normalizeDatabaseError(exception: unknown): {
  statusCode: number;
  code: ApiErrorCode;
  message: string;
} | null {
  const pgCode = getPgErrorCode(exception);
  if (pgCode === '23505') {
    return {
      statusCode: HttpStatus.CONFLICT,
      code: ApiErrorCode.DATABASE_CONFLICT,
      message: VI_API_MESSAGES.errors[ApiErrorCode.DATABASE_CONFLICT],
    };
  }
  if (pgCode === '23503') {
    return {
      statusCode: HttpStatus.BAD_REQUEST,
      code: ApiErrorCode.DATABASE_RELATION_NOT_FOUND,
      message: VI_API_MESSAGES.errors[ApiErrorCode.DATABASE_RELATION_NOT_FOUND],
    };
  }
  if (pgCode === '23502') {
    return {
      statusCode: HttpStatus.BAD_REQUEST,
      code: ApiErrorCode.DATABASE_REQUIRED_FIELD_MISSING,
      message: VI_API_MESSAGES.errors[ApiErrorCode.DATABASE_REQUIRED_FIELD_MISSING],
    };
  }
  return null;
}

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const normalized =
      exception instanceof HttpException
        ? normalizeHttpException(exception)
        : normalizeDatabaseError(exception) ?? {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            code: ApiErrorCode.INTERNAL_SERVER_ERROR,
            message: VI_API_MESSAGES.errors[ApiErrorCode.INTERNAL_SERVER_ERROR],
          };

    const payload: ApiErrorResponseDto = {
      success: false,
      statusCode: normalized.statusCode,
      code: normalized.code,
      message: normalized.message,
      details: normalized.details ?? [],
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    };

    response.status(normalized.statusCode).json(payload);
  }
}
```

- [ ] **Step 4: Register the filter globally**

Modify `src/main.ts`:

```ts
import { ApiExceptionFilter } from './shared/api/api-exception.filter';
```

After creating the Nest app and before `await app.listen(env.port)`:

```ts
app.useGlobalFilters(new ApiExceptionFilter());
```

- [ ] **Step 5: Run filter tests and build**

Run:

```bash
cd commerce-core-service-nestjs
npm test -- api-exception.filter.spec.ts
npm run build
```

Expected: both commands pass.

- [ ] **Step 6: Commit**

```bash
git add src/shared/api/api-exception.filter.ts src/shared/api/api-exception.filter.spec.ts src/main.ts
git commit -m "feat(core): normalize API errors in Vietnamese"
```

### Task 4: Convert Service Exceptions To Vietnamese Coded Errors

**Files:**
- Modify: `commerce-core-service-nestjs/src/modules/auth/auth.service.ts`
- Modify: `commerce-core-service-nestjs/src/modules/users-permissions/users-permissions.service.ts`
- Modify: `commerce-core-service-nestjs/src/modules/categories/categories.service.ts`
- Modify: `commerce-core-service-nestjs/src/modules/products/products.service.ts`
- Modify: `commerce-core-service-nestjs/src/modules/sellers/sellers.service.ts`
- Modify: `commerce-core-service-nestjs/src/modules/buyers/buyers.service.ts`
- Modify: `commerce-core-service-nestjs/src/modules/reviews/reviews.service.ts`
- Modify: `commerce-core-service-nestjs/src/modules/orders/orders.service.ts`
- Modify: `commerce-core-service-nestjs/src/modules/ingestion/ingestion.service.ts`
- Modify existing service specs or add focused tests where missing.

**Interfaces:**
- Consumes: `ApiErrorCode`, `VI_API_MESSAGES`, existing NestJS exception classes.
- Produces: all expected service exceptions contain `{ code, message }` with Vietnamese message text.

- [ ] **Step 1: Update auth service errors**

In `auth.service.ts`, add imports:

```ts
import { ApiErrorCode } from '../../shared/api/api-error-code';
import { VI_API_MESSAGES } from '../../shared/api/api-messages.vi';
```

Replace both invalid credential throws:

```ts
throw new UnauthorizedException({
  code: ApiErrorCode.AUTH_INVALID_CREDENTIALS,
  message: VI_API_MESSAGES.errors[ApiErrorCode.AUTH_INVALID_CREDENTIALS],
});
```

Replace user not found:

```ts
throw new UnauthorizedException({
  code: ApiErrorCode.AUTH_USER_NOT_FOUND,
  message: VI_API_MESSAGES.errors[ApiErrorCode.AUTH_USER_NOT_FOUND],
});
```

- [ ] **Step 2: Update users-permissions service errors**

In `users-permissions.service.ts`, replace duplicate email:

```ts
throw new ConflictException({
  code: ApiErrorCode.USER_EMAIL_EXISTS,
  message: VI_API_MESSAGES.errors[ApiErrorCode.USER_EMAIL_EXISTS],
});
```

Replace user not found:

```ts
throw new NotFoundException({
  code: ApiErrorCode.USER_NOT_FOUND,
  message: VI_API_MESSAGES.errors[ApiErrorCode.USER_NOT_FOUND],
});
```

- [ ] **Step 3: Update catalog/product/marketplace not-found errors**

Use this exact mapping:

```txt
categories.service.ts:
  Category not found -> CATEGORY_NOT_FOUND
  Category attribute not found -> CATEGORY_ATTRIBUTE_NOT_FOUND

products.service.ts:
  Product not found -> PRODUCT_NOT_FOUND

sellers.service.ts:
  Seller not found -> SELLER_NOT_FOUND

buyers.service.ts:
  Buyer not found -> BUYER_NOT_FOUND

reviews.service.ts:
  Review not found -> REVIEW_NOT_FOUND

orders.service.ts:
  Order not found -> ORDER_NOT_FOUND
```

Each replacement should follow this shape:

```ts
throw new NotFoundException({
  code: ApiErrorCode.PRODUCT_NOT_FOUND,
  message: VI_API_MESSAGES.errors[ApiErrorCode.PRODUCT_NOT_FOUND],
});
```

- [ ] **Step 4: Update ingestion not-found errors**

Use this exact mapping in `ingestion.service.ts`:

```txt
Data source not found -> DATA_SOURCE_NOT_FOUND
Sync run not found -> SYNC_RUN_NOT_FOUND
Raw snapshot not found -> RAW_SNAPSHOT_NOT_FOUND
```

Each replacement should follow this shape:

```ts
throw new NotFoundException({
  code: ApiErrorCode.DATA_SOURCE_NOT_FOUND,
  message: VI_API_MESSAGES.errors[ApiErrorCode.DATA_SOURCE_NOT_FOUND],
});
```

- [ ] **Step 5: Add or update service exception tests**

Update `categories.service.spec.ts` to assert coded Vietnamese not-found errors:

```ts
await expect(service.get('missing-id')).rejects.toMatchObject({
  response: {
    code: ApiErrorCode.CATEGORY_NOT_FOUND,
    message: 'Không tìm thấy danh mục.',
  },
});
```

Add focused tests for at least these high-risk services:

```txt
auth.service.spec.ts -> invalid login returns AUTH_INVALID_CREDENTIALS.
users-permissions.service.spec.ts -> duplicate email returns USER_EMAIL_EXISTS.
products.service.spec.ts -> missing product returns PRODUCT_NOT_FOUND.
ingestion.service.spec.ts -> missing data source returns DATA_SOURCE_NOT_FOUND.
```

Use mocked repositories with `findOne.mockResolvedValue(null)` for not-found paths. Do not connect to PostgreSQL.

- [ ] **Step 6: Run targeted service tests and build**

Run:

```bash
cd commerce-core-service-nestjs
npm test -- auth.service.spec.ts users-permissions.service.spec.ts categories.service.spec.ts products.service.spec.ts ingestion.service.spec.ts
npm run build
```

Expected: both commands pass.

- [ ] **Step 7: Commit**

```bash
git add src/modules
git commit -m "refactor(core): return coded Vietnamese service errors"
```

### Task 5: Convert Controller Success Messages And Swagger Descriptions

**Files:**
- Modify: `commerce-core-service-nestjs/src/modules/categories/cms-categories.controller.ts`
- Modify: `commerce-core-service-nestjs/src/modules/products/cms-products.controller.ts`
- Modify: `commerce-core-service-nestjs/src/modules/sellers/cms-sellers.controller.ts`
- Modify: `commerce-core-service-nestjs/src/modules/buyers/cms-buyers.controller.ts`
- Modify: `commerce-core-service-nestjs/src/modules/reviews/cms-reviews.controller.ts`
- Modify: `commerce-core-service-nestjs/src/modules/orders/cms-orders.controller.ts`
- Modify: `commerce-core-service-nestjs/src/modules/ingestion/cms-ingestion.controller.ts`
- Modify: `commerce-core-service-nestjs/src/modules/users-permissions/cms-users-permissions.controller.ts`
- Modify: matching controller specs.

**Interfaces:**
- Consumes: `VI_API_MESSAGES.success`.
- Produces: all success body messages and `@Api*Response.description` values in Vietnamese.

- [ ] **Step 1: Import Vietnamese message constants in each mutation controller**

Add this import to controllers that call `createSuccess`, `createCreated`, or `createBulkCreated`:

```ts
import { VI_API_MESSAGES } from '../../shared/api/api-messages.vi';
```

For `cms-users-permissions.controller.ts` and `cms-ingestion.controller.ts`, keep the same relative path:

```ts
import { VI_API_MESSAGES } from '../../shared/api/api-messages.vi';
```

- [ ] **Step 2: Replace controller success messages**

Use this exact mapping:

```txt
Category created successfully -> VI_API_MESSAGES.success.CATEGORY_CREATED
Category updated successfully -> VI_API_MESSAGES.success.CATEGORY_UPDATED
Category deleted successfully -> VI_API_MESSAGES.success.CATEGORY_DELETED
Category attribute created successfully -> VI_API_MESSAGES.success.CATEGORY_ATTRIBUTE_CREATED
Category attribute updated successfully -> VI_API_MESSAGES.success.CATEGORY_ATTRIBUTE_UPDATED
Category attribute deleted successfully -> VI_API_MESSAGES.success.CATEGORY_ATTRIBUTE_DELETED

Product created successfully -> VI_API_MESSAGES.success.PRODUCT_CREATED
Product updated successfully -> VI_API_MESSAGES.success.PRODUCT_UPDATED
Product deleted successfully -> VI_API_MESSAGES.success.PRODUCT_DELETED
Product variant created successfully -> VI_API_MESSAGES.success.PRODUCT_VARIANT_CREATED
Product images added successfully -> VI_API_MESSAGES.success.PRODUCT_IMAGES_ADDED

Seller created successfully -> VI_API_MESSAGES.success.SELLER_CREATED
Seller updated successfully -> VI_API_MESSAGES.success.SELLER_UPDATED
Buyer created successfully -> VI_API_MESSAGES.success.BUYER_CREATED
Buyer updated successfully -> VI_API_MESSAGES.success.BUYER_UPDATED
Review created successfully -> VI_API_MESSAGES.success.REVIEW_CREATED
Review updated successfully -> VI_API_MESSAGES.success.REVIEW_UPDATED
Order created successfully -> VI_API_MESSAGES.success.ORDER_CREATED
User created successfully -> VI_API_MESSAGES.success.USER_CREATED
User permissions updated successfully -> VI_API_MESSAGES.success.USER_PERMISSIONS_UPDATED
Data source created successfully -> VI_API_MESSAGES.success.DATA_SOURCE_CREATED
Data source updated successfully -> VI_API_MESSAGES.success.DATA_SOURCE_UPDATED
```

Example:

```ts
return createCreated(product.id, VI_API_MESSAGES.success.PRODUCT_CREATED);
```

- [ ] **Step 3: Replace import completion messages**

Modify `src/modules/ingestion/dto/import-run-response.dto.ts` so the helper accepts a kind:

```ts
import { VI_API_MESSAGES } from '../../../shared/api/api-messages.vi';

export type ImportRunKind = 'products' | 'reviews';

export function toImportRunResponse(
  run: {
    id: string;
    status: string;
    totalRecords: number;
    successCount: number;
    failedCount: number;
  },
  kind: ImportRunKind,
): ImportRunResponseDto {
  const success = run.failedCount === 0;
  const message =
    kind === 'products'
      ? success
        ? VI_API_MESSAGES.success.IMPORT_PRODUCTS_COMPLETED
        : VI_API_MESSAGES.success.IMPORT_PRODUCTS_COMPLETED_WITH_ERRORS
      : success
        ? VI_API_MESSAGES.success.IMPORT_REVIEWS_COMPLETED
        : VI_API_MESSAGES.success.IMPORT_REVIEWS_COMPLETED_WITH_ERRORS;

  return {
    success,
    syncRunId: run.id,
    status: run.status,
    totalRecords: run.totalRecords,
    successCount: run.successCount,
    failedCount: run.failedCount,
    message,
  };
}
```

Update `cms-ingestion.controller.ts` calls:

```ts
return toImportRunResponse(
  await this.ingestionService.importProducts(body),
  'products',
);
```

```ts
return toImportRunResponse(
  await this.ingestionService.importReviews(body),
  'reviews',
);
```

- [ ] **Step 4: Convert Swagger descriptions to Vietnamese**

Replace controller `@ApiOkResponse`, `@ApiCreatedResponse`, and `@ApiNoContentResponse` descriptions with Vietnamese text:

```txt
List of products -> Danh sách sản phẩm
Created product -> Tạo sản phẩm thành công
Product details -> Chi tiết sản phẩm
Product updated successfully -> Cập nhật sản phẩm thành công
Product deleted successfully -> Xóa sản phẩm thành công
List of users -> Danh sách người dùng
List of permissions -> Danh sách quyền
Product import sync run -> Kết quả nhập sản phẩm
Review import sync run -> Kết quả nhập đánh giá
```

Apply the same wording pattern to categories, sellers, buyers, reviews, orders, data sources, sync runs, raw snapshots, auth, and analytics. Use short Vietnamese descriptions, not long prose.

- [ ] **Step 5: Update controller tests**

Update every controller spec assertion from English to Vietnamese. Examples:

```ts
expect(result).toEqual({
  success: true,
  id: 'product-1',
  message: 'Tạo sản phẩm thành công.',
});
```

```ts
expect(result).toEqual({
  success: true,
  message: 'Cập nhật danh mục thành công.',
});
```

```ts
expect(result).toEqual({
  success: true,
  syncRunId: 'run-1',
  status: 'COMPLETED',
  totalRecords: 2,
  successCount: 2,
  failedCount: 0,
  message: 'Nhập sản phẩm hoàn tất.',
});
```

- [ ] **Step 6: Run targeted controller tests and build**

Run:

```bash
cd commerce-core-service-nestjs
npm test -- cms-users-permissions.controller.spec.ts cms-ingestion.controller.spec.ts cms-products.controller.spec.ts cms-categories.controller.spec.ts cms-sellers.controller.spec.ts cms-buyers.controller.spec.ts cms-reviews.controller.spec.ts cms-orders.controller.spec.ts
npm run build
```

Expected: both commands pass.

- [ ] **Step 7: Commit**

```bash
git add src/modules
git commit -m "refactor(core): use Vietnamese success messages"
```

### Task 6: Verify No English Client-Facing Messages Remain

**Files:**
- Modify: `commerce-core-service-nestjs/README.md`
- Inspect: `commerce-core-service-nestjs/src/**/*`

**Interfaces:**
- Consumes: final code from Tasks 1-5.
- Produces: documented Vietnamese API message policy and command evidence that English response strings were removed.

- [ ] **Step 1: Add README API message policy**

Add this section to `commerce-core-service-nestjs/README.md`:

```md
## CMS API Message Policy

- All client-facing `message` values are Vietnamese.
- Success responses use the shared `VI_API_MESSAGES.success` catalog.
- Service exceptions use `{ code, message }` payloads with `ApiErrorCode` and `VI_API_MESSAGES.errors`.
- Validation errors return `VALIDATION_FAILED` with Vietnamese field-level details.
- Database errors are normalized by `ApiExceptionFilter`; raw SQL, constraint names, stack traces, and internal error text are not returned to clients.
- Swagger response descriptions for CMS endpoints are Vietnamese.
```

- [ ] **Step 2: Scan for English success/error literals**

Run:

```bash
cd /Users/binner99/Works/Okz/ai-commerce-marketplace-platform
rg -n "'[^']*(created successfully|updated successfully|deleted successfully|not found|Invalid credentials|already exists|Import finished|with errors|List of)[^']*'|\"[^\"]*(created successfully|updated successfully|deleted successfully|not found|Invalid credentials|already exists|Import finished|with errors|List of)[^\"]*\"" commerce-core-service-nestjs/src --glob '!**/*.entity.ts' --glob '!**/dist/**'
```

Expected: no matches in controllers, services, shared API helpers, or specs. If matches remain only in internal test names or non-client-facing comments, rename them to Vietnamese or remove the client-facing wording.

- [ ] **Step 3: Run full verification**

Run:

```bash
cd commerce-core-service-nestjs
npm test
npm run build
```

Expected: both commands pass.

- [ ] **Step 4: Commit**

```bash
git add README.md src
git commit -m "docs(core): document Vietnamese API messages"
```

## Self-Review Checklist

- [ ] Spec coverage: success messages, service exceptions, validation errors, database errors, unexpected errors, and Swagger descriptions each have a task.
- [ ] Type consistency: `ApiErrorCode`, `VI_API_MESSAGES`, `ApiExceptionFilter`, and `createVietnameseValidationException` are defined before later tasks use them.
- [ ] Security check: unexpected errors do not expose original exception messages, SQL details, stack traces, or secrets.
- [ ] Verification check: every implementation task includes concrete `npm test` or `npm run build` commands.
- [ ] Language check: final scan command verifies no English client-facing success/error strings remain.

## Execution Handoff

Plan complete and saved to `commerce-core-service-nestjs/docs/2026-08-06-vietnamese-api-messages-plan.md`.

Two execution options:

1. **Subagent-Driven (recommended)** - Dispatch a fresh subagent per task, review between tasks, fast iteration.
2. **Inline Execution** - Execute tasks in this session using `superpowers:executing-plans`, batch execution with checkpoints.

Choose one before implementing. Do not start implementation from this plan without running the tests described in each task.
