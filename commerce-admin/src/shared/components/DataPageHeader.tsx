import { Button, Space, Typography, Breadcrumb } from 'antd';
import { PlusOutlined, ReloadOutlined, ExportOutlined } from '@ant-design/icons';
import type { ReactNode } from 'react';

interface DataPageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  onRefresh?: () => void;
}

export function DataPageHeader({ title, description, actions, onRefresh }: DataPageHeaderProps) {
  return (
    <div style={{ marginBottom: 24, background: '#ffffff', padding: '20px 24px', borderRadius: 12, border: '1px solid #e2e8f0' }}>
      <Breadcrumb
        style={{ marginBottom: 12, fontSize: 12 }}
        items={[
          { title: 'Trang chủ' },
          { title: 'Quản trị Admin' },
          { title: title },
        ]}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <Typography.Title level={3} style={{ margin: 0, fontWeight: 700, color: '#0f172a' }}>
            {title}
          </Typography.Title>
          {description ? (
            <Typography.Text type="secondary" style={{ fontSize: 13, color: '#64748b' }}>
              {description}
            </Typography.Text>
          ) : null}
        </div>

        <Space size={12}>
          {onRefresh && (
            <Button icon={<ReloadOutlined />} onClick={onRefresh}>
              Làm mới
            </Button>
          )}
          {actions !== undefined ? (
            actions
          ) : (
            <>
              <Button icon={<ExportOutlined />}>Xuất dữ liệu</Button>
              <Button type="primary" icon={<PlusOutlined />} style={{ background: '#4f46e5', fontWeight: 600 }}>
                Tạo mới
              </Button>
            </>
          )}
        </Space>
      </div>
    </div>
  );
}
