# AI Commerce Marketplace Platform - Docs

Thư mục này chứa tài liệu thiết kế cho hệ thống marketplace admin-first có AI platform.

## Tài liệu chính

- `superpowers/specs/2026-07-29-ai-commerce-marketplace-platform-design.md`: spec tổng hợp quyết định brainstorm.
- `superpowers/plans/2026-07-29-cms-base-implementation-plan.md`: implementation plan riêng cho base CMS.

## Tài liệu chuyên đề

- `architecture/overview.md`: tổng quan kiến trúc và roadmap phase 1.
- `architecture/phase-roadmap.md`: milestone chi tiết và thứ tự triển khai.
- `architecture/service-boundaries.md`: ranh giới trách nhiệm giữa các repo/service.
- `architecture/data-flow.md`: các luồng dữ liệu chính.
- `modules/admin-cms.md`: thiết kế admin React CMS.
- `modules/core-service.md`: trách nhiệm và module của core Java service.
- `modules/database-model.md`: data model cấp bảng cho phase 1.
- `modules/ai-platform.md`: thiết kế AI Platform NestJS.
- `modules/ingestion.md`: source registry, import, raw snapshot và hướng mở rộng crawler.
- `modules/permissions.md`: permission-based auth.
- `modules/realistic-dataset.md`: hướng tạo dữ liệu synthetic realistic.
- `modules/text-to-sql-safety.md`: guardrail cho AI Analyst text-to-SQL.
- `api-contracts/core-api.md`: draft API contract của core-service.
- `api-contracts/ai-api.md`: draft API contract của AI platform.
- `infra/local-docker.md`: thiết kế Docker local/full system.
- `core-service/implementation-brief.md`: brief riêng cho backend Java owner.
