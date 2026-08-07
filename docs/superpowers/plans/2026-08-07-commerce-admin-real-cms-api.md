# Commerce Admin Real CMS API Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove global mock API fallback from `commerce-admin` and connect current admin CMS pages to `commerce-core-service-nestjs` CMS APIs.

**Architecture:** Keep `commerce-admin` as a thin UI layer that calls `coreApi` through typed module API wrappers. Dashboard may keep local mock data. Pages without a real backend endpoint must show an empty/not-connected state instead of fake results.

**Tech Stack:** React 19, Vite 6, TypeScript 5.7, Ant Design 5, TanStack Query 5, Axios, NestJS CMS API under `/api/cms`.

## Global Constraints

- Do not add mock fallback for Core API calls.
- Keep dashboard mock data.
- Do not connect AI pages to Core API.
- Do not keep AI fake data while `commerce-ai-platform` endpoints are unavailable.
- Keep changes scoped to `commerce-admin` plus this plan file.
- Use `cmsPath()` for Core CMS endpoints.
- Preserve Vietnamese UI copy.
- Verify with `npm run build` from `commerce-admin`.

---

### Task 1: Remove Global Mock API Fallback

**Files:**
- Modify: `commerce-admin/src/app/AppProviders.tsx`
- Modify: `commerce-admin/src/shared/config/env.ts`
- Delete: `commerce-admin/src/shared/api/mock-adapter.ts`

**Steps:**
- [x] Remove `installMockApi` import and `env.useMockApi` gate from `AppProviders.tsx`.
- [x] Remove `useMockApi` from `env.ts`.
- [x] Delete `mock-adapter.ts`.
- [x] Remove `VITE_USE_MOCK_API` from `.env.example`.
- [x] Run `npm run build`.

### Task 2: Add Shared CMS API Types

**Steps:**
- [x] Reuse existing `PageResponse<T>` from `commerce-admin/src/shared/types/pagination.ts`.
- [x] Add module-local DTO types matching current NestJS CMS response DTOs.
- [x] Use these types in module API wrappers.

### Task 3: Connect Marketplace List Pages

**Files:**
- Create: product, seller, buyer, review, user/permission, ingestion API/type files where missing.
- Modify: existing admin pages to consume `useQuery`.

**Steps:**
- [x] Product list calls `GET /cms/products`.
- [x] Product detail calls `GET /cms/products/:id` and renders variants/images from detail response.
- [x] Product delete calls `DELETE /cms/products/:id`.
- [x] Sellers call `GET /cms/sellers`.
- [x] Buyers call `GET /cms/buyers`.
- [x] Reviews call `GET /cms/reviews`.
- [x] Users/permissions call `GET /cms/users`, `GET /cms/users/:id/permissions`, and `GET /cms/permissions`.
- [x] Ingestion calls `GET /cms/data-sources`, `GET /cms/sync-runs`, and `GET /cms/raw-snapshots`.
- [x] Remove fake AI page results while AI endpoints are unavailable.
- [x] Keep dashboard local mock data.

### Task 4: Verify

**Steps:**
- [x] Run focused red/green API test for product wrappers.
- [x] Run `npm run build` from `commerce-admin`.
- [x] Run `npm test` from `commerce-admin`.
- [x] Run `git diff --check`.
- [ ] Run `npm run lint` from `commerce-admin`.
  - Blocked by existing ESLint 9 config issue: missing `eslint.config.*`.
