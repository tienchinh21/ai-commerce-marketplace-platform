import { Tag } from 'antd';
import {
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  StopOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { STATUS_MAP } from '@/shared/constants/status.constants';

const ICON_MAP: Record<string, React.ReactNode> = {
  ACTIVE: <CheckCircleOutlined />,
  INACTIVE: <StopOutlined />,
  DRAFT: <FileTextOutlined />,
  PENDING: <ClockCircleOutlined />,
  FAILED: <CloseCircleOutlined />,
  COMPLETED: <CheckCircleOutlined />,
  RUNNING: <SyncOutlined spin />,
};

export function StatusTag({ status }: { status: string }) {
  const meta = STATUS_MAP[status] ?? { color: 'default', label: status };
  const icon = ICON_MAP[status] ?? null;

  return (
    <Tag color={meta.color} icon={icon} style={{ borderRadius: 10, fontWeight: 600, padding: '2px 8px' }}>
      {meta.label}
    </Tag>
  );
}
