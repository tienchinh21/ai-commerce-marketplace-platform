import { ReactNode } from 'react';
import { Button, Space, Typography, Breadcrumb } from 'antd';
import { PlusOutlined, ReloadOutlined, ExportOutlined, HomeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/routes.constants';

export interface CustomBreadcrumbItem {
  title: ReactNode;
  path?: string;
}

interface DataPageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: CustomBreadcrumbItem[];
  actions?: ReactNode;
  onRefresh?: () => void;
}

export function DataPageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  onRefresh,
}: DataPageHeaderProps) {
  const defaultBreadcrumbs = [
    {
      title: (
        <Link to={ROUTES.DASHBOARD}>
          <Space size={4}>
            <HomeOutlined />
            <span>Trang chủ</span>
          </Space>
        </Link>
      ),
    },
    {
      title: <span>{title}</span>,
    },
  ];

  const breadcrumbItems = breadcrumbs
    ? breadcrumbs.map((item) => ({
        title: item.path ? <Link to={item.path}>{item.title}</Link> : item.title,
      }))
    : defaultBreadcrumbs;

  return (
    <div style={{ marginBottom: 20 }}>
      <Breadcrumb style={{ marginBottom: 12 }} items={breadcrumbItems} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <Typography.Title level={3} style={{ margin: 0 }}>
            {title}
          </Typography.Title>
          {description && (
            <Typography.Text type="secondary" style={{ marginTop: 4, display: 'inline-block' }}>
              {description}
            </Typography.Text>
          )}
        </div>

        <Space size={8}>
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
              <Button type="primary" icon={<PlusOutlined />}>
                Tạo mới
              </Button>
            </>
          )}
        </Space>
      </div>
    </div>
  );
}
