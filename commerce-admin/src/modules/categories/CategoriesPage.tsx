import { useState } from 'react';
import { Card, Input, Space, Button, Tag, Tooltip, Popconfirm, message } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined, SettingOutlined, AppstoreOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { DataPageHeader } from '@/shared/components/DataPageHeader';
import { StatusTag } from '@/shared/components/StatusTag';
import { CoreTable } from '@/shared/components/CoreTable';
import { fetchCategories } from './category.api';
import type { Category } from './category.types';

export function CategoriesPage() {
  const [searchText, setSearchText] = useState('');
  const query = useQuery({ queryKey: ['categories'], queryFn: fetchCategories });

  const filteredData = (query.data ?? []).filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase()) ||
    item.slug.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, gap: 20 }}>
      <DataPageHeader
        title="Danh Mục Sản Phẩm"
        description="Quản lý cây danh mục (Category Tree) và các thuộc tính động (Dynamic Category Attributes)."
        onRefresh={() => query.refetch()}
      />

      <Card style={{ borderRadius: 12, border: '1px solid #e2e8f0', flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }} bodyStyle={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, padding: 20 }}>
        <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Input
            prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
            placeholder="Tìm theo tên danh mục hoặc slug..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 340, borderRadius: 8 }}
            allowClear
          />
          <Space>
            <Tag color="indigo" style={{ padding: '4px 12px', fontSize: 13, borderRadius: 12 }}>
              Tổng số: {filteredData.length} danh mục
            </Tag>
          </Space>
        </div>

        <CoreTable<Category>
          rowKey="id"
          loading={query.isLoading}
          dataSource={filteredData}
          columns={[
            {
              title: 'Tên danh mục',
              dataIndex: 'name',
              render: (text, record) => (
                <Space>
                  <AppstoreOutlined style={{ color: '#6366f1' }} />
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{text}</span>
                  <Tag color="blue" style={{ fontSize: 11 }}>{record.slug}</Tag>
                </Space>
              ),
            },
            {
              title: 'Đường dẫn (Path)',
              dataIndex: 'path',
              render: (path) => <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: 4, color: '#475569' }}>{path}</code>,
            },
            {
              title: 'Cấp độ (Level)',
              dataIndex: 'level',
              render: (level) => <Tag color="purple">Cấp {level}</Tag>,
            },
            {
              title: 'Trạng thái',
              dataIndex: 'status',
              render: (status) => <StatusTag status={status} />,
            },
            {
              title: 'Thao tác',
              key: 'actions',
              align: 'right',
              render: () => (
                <Space size={8}>
                  <Tooltip title="Cấu hình thuộc tính">
                    <Button type="text" icon={<SettingOutlined style={{ color: '#6366f1' }} />} />
                  </Tooltip>
                  <Tooltip title="Chỉnh sửa">
                    <Button type="text" icon={<EditOutlined style={{ color: '#0284c7' }} />} />
                  </Tooltip>
                  <Tooltip title="Xóa">
                    <Popconfirm title="Xóa danh mục này?" onConfirm={() => message.info('Tính năng đang phát triển')}>
                      <Button type="text" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                  </Tooltip>
                </Space>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}
