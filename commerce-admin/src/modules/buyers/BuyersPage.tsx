import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Alert, Avatar, Card, Input, Space, Tag } from 'antd';
import { SearchOutlined, UserOutlined } from '@ant-design/icons';
import { DataPageHeader } from '@/shared/components/DataPageHeader';
import { StatusTag } from '@/shared/components/StatusTag';
import { CoreTable } from '@/shared/components/CoreTable';
import { useDebounce } from '@/shared/hooks';
import { extractErrorMessage } from '@/shared/utils/error-handler';
import { formatDateTime } from '@/shared/utils/formatters';
import { fetchBuyers } from './buyer.api';
import type { Buyer } from './buyer.types';

const DEFAULT_PAGE_SIZE = 20;

export function BuyersPage() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const debouncedKeyword = useDebounce(searchKeyword, 300);

  const buyersQuery = useQuery({
    queryKey: ['cms-buyers', debouncedKeyword, page, pageSize],
    queryFn: () =>
      fetchBuyers({
        search: debouncedKeyword.trim() || undefined,
        page,
        pageSize,
      }),
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, gap: 20 }}>
      <DataPageHeader
        title="Quản Lý Khách Hàng (Buyers)"
        description="Danh sách người mua hàng, tài khoản và lịch sử đơn hàng."
        onRefresh={() => buyersQuery.refetch()}
      />

      {buyersQuery.isError && (
        <Alert type="error" showIcon message="Không tải được danh sách khách hàng" description={extractErrorMessage(buyersQuery.error)} />
      )}

      <Card style={{ borderRadius: 12, border: '1px solid #e2e8f0', flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }} bodyStyle={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, padding: 20 }}>
        <div style={{ marginBottom: 20 }}>
          <Input
            prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
            placeholder="Tìm theo tên, email hoặc số điện thoại..."
            value={searchKeyword}
            onChange={(event) => {
              setSearchKeyword(event.target.value);
              setPage(1);
            }}
            style={{ width: 340, borderRadius: 8 }}
            allowClear
          />
        </div>

        <CoreTable<Buyer>
          dataSource={buyersQuery.data?.items ?? []}
          rowKey="id"
          loading={buyersQuery.isLoading}
          pagination={{
            current: buyersQuery.data?.page ?? page,
            pageSize: buyersQuery.data?.pageSize ?? pageSize,
            total: buyersQuery.data?.total ?? 0,
            showSizeChanger: true,
            onChange: (nextPage, nextPageSize) => {
              setPage(nextPage);
              setPageSize(nextPageSize);
            },
          }}
          columns={[
            {
              title: 'Tên khách hàng',
              dataIndex: 'displayName',
              render: (text: string) => (
                <Space>
                  <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }} />
                  <span style={{ fontWeight: 600 }}>{text}</span>
                </Space>
              ),
            },
            { title: 'Email', dataIndex: 'email' },
            { title: 'Số điện thoại', dataIndex: 'phone', render: (phone: string | null) => phone || '-' },
            { title: 'User ID', dataIndex: 'userId', render: (userId: string | null) => userId ? <Tag>{userId.slice(0, 8)}</Tag> : '-' },
            { title: 'Ngày tạo', dataIndex: 'createdAt', render: (createdAt: string) => formatDateTime(createdAt) },
            { title: 'Trạng thái', dataIndex: 'status', render: (status: string) => <StatusTag status={status} /> },
          ]}
        />
      </Card>
    </div>
  );
}
