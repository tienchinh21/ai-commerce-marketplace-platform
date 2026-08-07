export type CommonStatus =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'DRAFT'
  | 'PENDING'
  | 'FAILED'
  | 'COMPLETED'
  | 'RUNNING';

export interface StatusMeta {
  color: string;
  label: string;
  badgeStatus: 'success' | 'processing' | 'default' | 'error' | 'warning';
}

export const STATUS_MAP: Record<string, StatusMeta> = {
  ACTIVE: { color: 'success', label: 'HOẠT ĐỘNG', badgeStatus: 'success' },
  INACTIVE: { color: 'default', label: 'TẠM DỪNG', badgeStatus: 'default' },
  DRAFT: { color: 'blue', label: 'BẢN NHÁP', badgeStatus: 'default' },
  PENDING: { color: 'warning', label: 'ĐANG XỬ LÝ', badgeStatus: 'warning' },
  FAILED: { color: 'error', label: 'THẤT BẠI', badgeStatus: 'error' },
  COMPLETED: { color: 'success', label: 'HOÀN THÀNH', badgeStatus: 'success' },
  RUNNING: { color: 'processing', label: 'ĐANG CHẠY', badgeStatus: 'processing' },
};

export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE_SIZE_OPTIONS = ['10', '20', '50', '100'];
