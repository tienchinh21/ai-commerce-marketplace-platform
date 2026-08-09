import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Alert, Card, Input, Rate, Space, Typography } from 'antd';
import { CommentOutlined, SearchOutlined } from '@ant-design/icons';
import { DataPageHeader } from '@/shared/components/DataPageHeader';
import { StatusTag } from '@/shared/components/StatusTag';
import { CoreTable } from '@/shared/components/CoreTable';
import { useDebounce } from '@/shared/hooks';
import { extractErrorMessage } from '@/shared/utils/error-handler';
import { formatDateTime, truncateText } from '@/shared/utils/formatters';
import { fetchReviews } from './review.api';
import type { Review } from './review.types';

const DEFAULT_PAGE_SIZE = 20;

export function ReviewsPage() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const debouncedKeyword = useDebounce(searchKeyword, 300);

  const reviewsQuery = useQuery({
    queryKey: ['cms-reviews', page, pageSize],
    queryFn: () => fetchReviews({ page, pageSize }),
  });

  const reviews = useMemo(() => {
    const items = reviewsQuery.data?.items ?? [];
    const query = debouncedKeyword.trim().toLowerCase();
    if (!query) return items;
    return items.filter((review) =>
      [
        review.productId,
        review.buyerId,
        review.sellerId,
        review.title,
        review.content,
        review.sourceType,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [reviewsQuery.data?.items, debouncedKeyword]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, gap: 20 }}>
      <DataPageHeader
        title="Quản Lý Đánh Giá & Phản Hồi (Reviews)"
        description="Quản lý dữ liệu đánh giá nguyên bản từ khách hàng và các trạng thái kiểm duyệt (Moderation)."
        onRefresh={() => reviewsQuery.refetch()}
      />

      {reviewsQuery.isError && (
        <Alert type="error" showIcon message="Không tải được danh sách đánh giá" description={extractErrorMessage(reviewsQuery.error)} />
      )}

      <Card style={{ borderRadius: 12, border: '1px solid #e2e8f0', flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }} bodyStyle={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, padding: 20 }}>
        <div style={{ marginBottom: 20 }}>
          <Input
            prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
            placeholder="Lọc theo productId, buyerId, sellerId, nội dung..."
            value={searchKeyword}
            onChange={(event) => setSearchKeyword(event.target.value)}
            style={{ width: 420, borderRadius: 8 }}
            allowClear
          />
        </div>

        <CoreTable<Review>
          dataSource={reviews}
          rowKey="id"
          loading={reviewsQuery.isLoading}
          pagination={{
            current: reviewsQuery.data?.page ?? page,
            pageSize: reviewsQuery.data?.pageSize ?? pageSize,
            total: reviewsQuery.data?.total ?? 0,
            showSizeChanger: true,
            onChange: (nextPage, nextPageSize) => {
              setPage(nextPage);
              setPageSize(nextPageSize);
            },
          }}
          columns={[
            {
              title: 'Sản phẩm',
              dataIndex: 'productId',
              render: (productId: string) => (
                <Space>
                  <CommentOutlined style={{ color: '#6366f1' }} />
                  <Typography.Text copyable style={{ fontWeight: 600 }}>{productId}</Typography.Text>
                </Space>
              ),
            },
            { title: 'Người viết', dataIndex: 'buyerId', render: (buyerId: string | null) => buyerId || '-' },
            {
              title: 'Điểm đánh giá',
              dataIndex: 'rating',
              render: (rating: number) => <Rate disabled defaultValue={rating} style={{ fontSize: 13 }} />,
            },
            { title: 'Tiêu đề', dataIndex: 'title', render: (title: string | null) => title || '-' },
            { title: 'Nội dung phản hồi', dataIndex: 'content', width: 360, render: (content: string | null) => truncateText(content, 120) || '-' },
            { title: 'Nguồn', dataIndex: 'sourceType' },
            { title: 'Ngày tạo', dataIndex: 'createdAt', render: (createdAt: string) => formatDateTime(createdAt) },
            { title: 'Trạng thái', dataIndex: 'status', render: (status: string) => <StatusTag status={status} /> },
          ]}
        />
      </Card>
    </div>
  );
}
