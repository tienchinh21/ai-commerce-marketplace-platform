import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Alert, Avatar, Button, Card, Input, Space, Tag } from 'antd';
import { PlusOutlined, SearchOutlined, ShopOutlined } from '@ant-design/icons';
import { DataPageHeader } from '@/shared/components/DataPageHeader';
import { StatusTag } from '@/shared/components/StatusTag';
import { CoreTable } from '@/shared/components/CoreTable';
import { useDebounce } from '@/shared/hooks';
import { extractErrorMessage } from '@/shared/utils/error-handler';
import { formatDateTime } from '@/shared/utils/formatters';
import { fetchSellers } from './seller.api';
import type { Seller } from './seller.types';

const DEFAULT_PAGE_SIZE = 20;

export function SellersPage() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const debouncedKeyword = useDebounce(searchKeyword, 300);

  const sellersQuery = useQuery({
    queryKey: ['cms-sellers', debouncedKeyword, page, pageSize],
    queryFn: () =>
      fetchSellers({
        search: debouncedKeyword.trim() || undefined,
        page,
        pageSize,
      }),
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, gap: 20 }}>
      <DataPageHeader
        title="Quản Lý Nhà Bán Hàng (Sellers)"
        description="Danh sách đối tác bán hàng, gian hàng và chỉ số đánh giá uy tín."
        onRefresh={() => sellersQuery.refetch()}
      />

      {sellersQuery.isError && (
        <Alert type="error" showIcon message="Không tải được danh sách nhà bán hàng" description={extractErrorMessage(sellersQuery.error)} />
      )}

      <Card style={{ borderRadius: 12, border: '1px solid #e2e8f0', flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }} bodyStyle={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, padding: 20 }}>
        <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Input
            prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
            placeholder="Tìm theo tên nhà bán hàng..."
            value={searchKeyword}
            onChange={(event) => {
              setSearchKeyword(event.target.value);
              setPage(1);
            }}
            style={{ width: 340, borderRadius: 8 }}
            allowClear
          />
          <Button type="primary" icon={<PlusOutlined />} style={{ background: '#4f46e5' }}>
            Thêm Nhà Bán Hàng
          </Button>
        </div>

        <CoreTable<Seller>
          dataSource={sellersQuery.data?.items ?? []}
          rowKey="id"
          loading={sellersQuery.isLoading}
          pagination={{
            current: sellersQuery.data?.page ?? page,
            pageSize: sellersQuery.data?.pageSize ?? pageSize,
            total: sellersQuery.data?.total ?? 0,
            showSizeChanger: true,
            onChange: (nextPage, nextPageSize) => {
              setPage(nextPage);
              setPageSize(nextPageSize);
            },
          }}
          columns={[
            {
              title: 'Nhà bán hàng',
              dataIndex: 'name',
              render: (text: string) => (
                <Space>
                  <Avatar icon={<ShopOutlined />} style={{ backgroundColor: '#e0e7ff', color: '#4f46e5' }} />
                  <span style={{ fontWeight: 600 }}>{text}</span>
                </Space>
              ),
            },
            { title: 'Slug gian hàng', dataIndex: 'slug', render: (slug: string) => <Tag color="blue">{slug}</Tag> },
            { title: 'User ID', dataIndex: 'userId', render: (userId: string | null) => userId ? <Tag>{userId.slice(0, 8)}</Tag> : '-' },
            { title: 'Ngày tạo', dataIndex: 'createdAt', render: (createdAt: string) => formatDateTime(createdAt) },
            { title: 'Trạng thái', dataIndex: 'status', render: (status: string) => <StatusTag status={status} /> },
          ]}
        />
      </Card>
    </div>
  );
}
