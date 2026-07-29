import type { PermissionCode } from '../modules/auth/auth.types';

export interface AdminRouteConfig {
  path: string;
  label: string;
  group?: string;
  permission: PermissionCode | null;
}

export const adminRoutes: AdminRouteConfig[] = [
  { path: '/', label: 'Tổng quan System', group: 'Chung', permission: null },
  { path: '/categories', label: 'Danh mục sản phẩm', group: 'Marketplace Core', permission: 'category:read' },
  { path: '/products', label: 'Quản lý Sản phẩm', group: 'Marketplace Core', permission: 'product:read' },
  { path: '/sellers', label: 'Nhà bán hàng (Sellers)', group: 'Marketplace Core', permission: 'seller:read' },
  { path: '/buyers', label: 'Khách hàng (Buyers)', group: 'Marketplace Core', permission: 'buyer:read' },
  { path: '/reviews', label: 'Đánh giá & Phản hồi', group: 'Marketplace Core', permission: 'review:read' },
  { path: '/ingestion', label: 'Nguồn & Tải dữ liệu', group: 'Data Ingestion', permission: 'source:read' },
  { path: '/ai-search', label: 'Tìm kiếm Semantic AI', group: 'AI Platform', permission: 'ai:search' },
  { path: '/review-intelligence', label: 'Phân tích Review AI', group: 'AI Platform', permission: 'ai:review:analyze' },
  { path: '/analyst-chat', label: 'Trợ lý Báo cáo AI (Text-to-SQL)', group: 'AI Platform', permission: 'ai:analyst:chat' },
  { path: '/users-permissions', label: 'Người dùng & Phân quyền', group: 'Hệ thống', permission: null },
];
