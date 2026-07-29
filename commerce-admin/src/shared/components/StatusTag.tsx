import { Tag } from 'antd';

const colorByStatus: Record<string, string> = {
  ACTIVE: 'green',
  INACTIVE: 'default',
  DRAFT: 'blue',
  PENDING: 'gold',
  FAILED: 'red',
  COMPLETED: 'green',
};

export function StatusTag({ status }: { status: string }) {
  return <Tag color={colorByStatus[status] ?? 'default'}>{status}</Tag>;
}
