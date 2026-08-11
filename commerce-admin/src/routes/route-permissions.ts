import type { PermissionCode } from '@/modules/auth/auth.types';
import { ROUTES } from '@/shared/constants/routes.constants';

export interface AdminRouteConfig {
  path: string;
  label: string;
  group?: string;
  permission: PermissionCode | null;
}

export const adminRoutes: AdminRouteConfig[] = [
  { path: ROUTES.DASHBOARD, label: 'Tổng quan System', group: 'Chung', permission: null },
  { path: ROUTES.CATEGORIES, label: 'Danh mục sản phẩm', group: 'Marketplace Core', permission: 'category:read' },
  { path: ROUTES.PRODUCTS, label: 'Quản lý Sản phẩm', group: 'Marketplace Core', permission: 'product:read' },
  { path: ROUTES.SELLERS, label: 'Nhà bán hàng (Sellers)', group: 'Marketplace Core', permission: 'seller:read' },
  { path: ROUTES.BUYERS, label: 'Khách hàng (Buyers)', group: 'Marketplace Core', permission: 'buyer:read' },
  { path: ROUTES.ORDERS, label: 'Đơn hàng', group: 'Marketplace Core', permission: 'product:read' },
  { path: ROUTES.REVIEWS, label: 'Đánh giá & Phản hồi', group: 'Marketplace Core', permission: 'review:read' },
  { path: ROUTES.INGESTION, label: 'Nguồn & Tải dữ liệu', group: 'Data Ingestion', permission: 'source:read' },
  { path: ROUTES.AI_SEARCH, label: 'Tìm kiếm Semantic AI', group: 'AI Platform', permission: 'ai:search' },
  { path: ROUTES.REVIEW_INTELLIGENCE, label: 'Phân tích Review AI', group: 'AI Platform', permission: 'ai:review:analyze' },
  { path: ROUTES.ANALYST_CHAT, label: 'Trợ lý Báo cáo AI (Text-to-SQL)', group: 'AI Platform', permission: 'ai:analyst:chat' },
  { path: ROUTES.USERS_PERMISSIONS, label: 'Người dùng & Phân quyền', group: 'Hệ thống', permission: null },
];
