import type { PermissionCode } from '../modules/auth/auth.types';

export interface AdminRouteConfig {
  path: string;
  label: string;
  permission: PermissionCode | null;
}

export const adminRoutes: AdminRouteConfig[] = [
  { path: '/', label: 'Dashboard', permission: null },
  { path: '/categories', label: 'Categories', permission: 'category:read' },
  { path: '/sellers', label: 'Sellers', permission: 'seller:read' },
  { path: '/buyers', label: 'Buyers', permission: 'buyer:read' },
  { path: '/products', label: 'Products', permission: 'product:read' },
  { path: '/reviews', label: 'Reviews', permission: 'review:read' },
  { path: '/ingestion', label: 'Data Sources', permission: 'source:read' },
  { path: '/ai-search', label: 'AI Search', permission: 'ai:search' },
  { path: '/review-intelligence', label: 'Review Intelligence', permission: 'ai:review:analyze' },
  { path: '/analyst-chat', label: 'AI Analyst', permission: 'ai:analyst:chat' },
  { path: '/users-permissions', label: 'Users & Permissions', permission: null },
];
