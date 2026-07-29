import { Tag } from 'antd';
import {
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  StopOutlined,
  FileTextOutlined,
} from '@ant-design/icons';

const statusConfig: Record<string, { color: string; label: string; icon: React.ReactNode }> = {
  ACTIVE: { color: 'success', label: 'HOẠT ĐỘNG', icon: <CheckCircleOutlined /> },
  INACTIVE: { color: 'default', label: 'TẠM DỪNG', icon: <StopOutlined /> },
  DRAFT: { color: 'blue', label: 'BẢN NHÁP', icon: <FileTextOutlined /> },
  PENDING: { color: 'warning', label: 'ĐANG XỬ LÝ', icon: <ClockCircleOutlined /> },
  FAILED: { color: 'error', label: 'THẤT BẠI', icon: <CloseCircleOutlined /> },
  COMPLETED: { color: 'success', label: 'HOÀN THÀNH', icon: <CheckCircleOutlined /> },
  RUNNING: { color: 'processing', label: 'ĐANG CHẠY', icon: <SyncOutlined spin /> },
};

export function StatusTag({ status }: { status: string }) {
  const config = statusConfig[status] ?? { color: 'default', label: status, icon: null };
  return (
    <Tag color={config.color} icon={config.icon} style={{ borderRadius: 10, fontWeight: 600, padding: '2px 8px' }}>
      {config.label}
    </Tag>
  );
}
