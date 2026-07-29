import { Button, Space, Typography } from 'antd';
import type { ReactNode } from 'react';

interface DataPageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function DataPageHeader({ title, description, actions }: DataPageHeaderProps) {
  return (
    <Space direction="vertical" size={4} style={{ width: '100%', marginBottom: 16 }}>
      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
        <div>
          <Typography.Title level={3} style={{ margin: 0 }}>{title}</Typography.Title>
          {description ? <Typography.Text type="secondary">{description}</Typography.Text> : null}
        </div>
        {actions !== undefined ? actions : <Button type="primary">Tạo mới</Button>}
      </Space>
    </Space>
  );
}
