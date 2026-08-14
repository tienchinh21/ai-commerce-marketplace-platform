import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert, Button, Card, Descriptions, Drawer, Form, Input, InputNumber, Modal, Rate, Select, Space, Typography } from 'antd';
import { EditOutlined, EyeOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { DataPageHeader } from '@/shared/components/DataPageHeader';
import { StatusTag } from '@/shared/components/StatusTag';
import { CoreTable } from '@/shared/components/CoreTable';
import { useDebounce, useModalState, useNotification } from '@/shared/hooks';
import { extractErrorMessage } from '@/shared/utils/error-handler';
import { formatDateTime, truncateText } from '@/shared/utils/formatters';
import { createReview, fetchReviewDetail, fetchReviews, updateReview } from './review.api';
import type { Review, ReviewPayload } from './review.types';

const DEFAULT_PAGE_SIZE = 20;
const statusOptions = [
  { value: 'ACTIVE', label: 'ACTIVE' },
  { value: 'HIDDEN', label: 'HIDDEN' },
  { value: 'PENDING', label: 'PENDING' },
];

type ReviewFormValues = ReviewPayload;

export function ReviewsPage() {
  const notify = useNotification();
  const queryClient = useQueryClient();
  const [reviewForm] = Form.useForm<ReviewFormValues>();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const debouncedKeyword = useDebounce(searchKeyword, 300);
  const reviewModal = useModalState<Review>();
  const detailDrawer = useModalState<Review>();

  const reviewsQuery = useQuery({
    queryKey: ['cms-reviews', statusFilter, page, pageSize],
    queryFn: () => fetchReviews({ status: statusFilter, page, pageSize }),
  });

  const reviewDetailQuery = useQuery({
    queryKey: ['cms-review-detail', detailDrawer.data?.id],
    queryFn: () => fetchReviewDetail(detailDrawer.data?.id as string),
    enabled: detailDrawer.open && Boolean(detailDrawer.data?.id),
  });

  const createMutation = useMutation({
    mutationFn: createReview,
    onSuccess: async () => {
      notify.success('Đã tạo đánh giá.');
      reviewForm.resetFields();
      reviewModal.hideModal();
      await queryClient.invalidateQueries({ queryKey: ['cms-reviews'] });
    },
    onError: (error) => notify.error(error, 'Tạo đánh giá thất bại.'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<ReviewPayload> }) => updateReview(id, payload),
    onSuccess: async () => {
      notify.success('Đã cập nhật đánh giá.');
      reviewForm.resetFields();
      reviewModal.hideModal();
      await queryClient.invalidateQueries({ queryKey: ['cms-reviews'] });
    },
    onError: (error) => notify.error(error, 'Cập nhật đánh giá thất bại.'),
  });

  const reviews = useMemo(() => {
    const items = reviewsQuery.data?.items ?? [];
    const query = debouncedKeyword.trim().toLowerCase();
    if (!query) return items;
    return items.filter((review) =>
      [review.productId, review.buyerId, review.sellerId, review.title, review.content, review.sourceType]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query)),
    );
  }, [reviewsQuery.data?.items, debouncedKeyword]);

  function openCreateModal() {
    reviewForm.resetFields();
    reviewForm.setFieldsValue({ rating: 5, status: 'ACTIVE', sourceType: 'manual' });
    reviewModal.showModal();
  }

  function openEditModal(review: Review) {
    reviewForm.setFieldsValue({
      productId: review.productId,
      buyerId: review.buyerId,
      sellerId: review.sellerId,
      rating: review.rating,
      title: review.title,
      content: review.content,
      status: review.status,
      sourceType: review.sourceType,
    });
    reviewModal.showModal(review);
  }

  function handleSubmit(values: ReviewFormValues) {
    if (reviewModal.data) {
      updateMutation.mutate({
        id: reviewModal.data.id,
        payload: {
          rating: values.rating,
          title: values.title || null,
          content: values.content || null,
          status: values.status ?? 'ACTIVE',
        },
      });
      return;
    }

    createMutation.mutate({
      productId: values.productId,
      buyerId: values.buyerId || null,
      sellerId: values.sellerId || null,
      rating: values.rating,
      title: values.title || null,
      content: values.content || null,
      status: values.status ?? 'ACTIVE',
      sourceType: values.sourceType || 'manual',
    });
  }

  const activeReview = reviewDetailQuery.data ?? detailDrawer.data;
  const isEditing = Boolean(reviewModal.data);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, gap: 20 }}>
      <DataPageHeader
        title="Quản Lý Đánh Giá & Phản Hồi (Reviews)"
        description="Quản lý dữ liệu đánh giá và trạng thái kiểm duyệt."
        onRefresh={() => reviewsQuery.refetch()}
        actions={
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal} style={{ background: '#4f46e5' }}>
            Tạo Review Manual
          </Button>
        }
      />

      {reviewsQuery.isError && (
        <Alert type="error" showIcon message="Không tải được danh sách đánh giá" description={extractErrorMessage(reviewsQuery.error)} />
      )}

      <Card style={{ borderRadius: 12, border: '1px solid #e2e8f0', flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }} bodyStyle={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, padding: 20 }}>
        <div style={{ marginBottom: 20, display: 'flex', gap: 12 }}>
          <Input
            prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
            placeholder="Lọc theo productId, buyerId, sellerId, nội dung..."
            value={searchKeyword}
            onChange={(event) => setSearchKeyword(event.target.value)}
            style={{ width: 420, borderRadius: 8 }}
            allowClear
          />
          <Select
            allowClear
            placeholder="Trạng thái"
            value={statusFilter}
            options={statusOptions}
            onChange={(value) => {
              setStatusFilter(value);
              setPage(1);
            }}
            style={{ width: 160 }}
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
                <Typography.Text copyable style={{ fontWeight: 600 }}>{productId}</Typography.Text>
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
            {
              title: 'Thao tác',
              key: 'actions',
              render: (_, record) => (
                <Space size={4}>
                  <Button type="text" icon={<EyeOutlined />} onClick={() => detailDrawer.showModal(record)}>
                    Chi tiết
                  </Button>
                  <Button type="text" icon={<EditOutlined />} onClick={() => openEditModal(record)}>
                    Sửa
                  </Button>
                </Space>
              ),
            },
          ]}
        />
      </Card>

      <Modal
        open={reviewModal.open}
        title={isEditing ? 'Cập nhật đánh giá' : 'Tạo đánh giá manual'}
        okText={isEditing ? 'Cập nhật' : 'Tạo mới'}
        cancelText="Hủy"
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        onOk={() => reviewForm.submit()}
        onCancel={reviewModal.hideModal}
        destroyOnHidden
        width={680}
      >
        <Form<ReviewFormValues> form={reviewForm} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="productId" label="Product ID" rules={[{ required: true, message: 'Nhập product ID.' }]}>
            <Input disabled={isEditing} />
          </Form.Item>
          <Space size={16} style={{ width: '100%' }} align="start">
            <Form.Item name="buyerId" label="Buyer ID" style={{ flex: 1 }}>
              <Input disabled={isEditing} allowClear />
            </Form.Item>
            <Form.Item name="sellerId" label="Seller ID" style={{ flex: 1 }}>
              <Input disabled={isEditing} allowClear />
            </Form.Item>
          </Space>
          <Space size={16} style={{ width: '100%' }} align="start">
            <Form.Item name="rating" label="Điểm" rules={[{ required: true, message: 'Nhập điểm.' }]} style={{ flex: 1 }}>
              <InputNumber min={1} max={5} precision={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="status" label="Trạng thái" style={{ flex: 1 }}>
              <Select options={statusOptions} />
            </Form.Item>
            <Form.Item name="sourceType" label="Nguồn" style={{ flex: 1 }}>
              <Input disabled={isEditing} />
            </Form.Item>
          </Space>
          <Form.Item name="title" label="Tiêu đề">
            <Input />
          </Form.Item>
          <Form.Item name="content" label="Nội dung">
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>

      <Drawer title="Chi tiết đánh giá" open={detailDrawer.open} onClose={detailDrawer.hideModal} width={560}>
        {reviewDetailQuery.isError && <Alert type="error" showIcon message="Không tải được chi tiết" description={extractErrorMessage(reviewDetailQuery.error)} />}
        {activeReview && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Product ID">{activeReview.productId}</Descriptions.Item>
            <Descriptions.Item label="Buyer ID">{activeReview.buyerId || '-'}</Descriptions.Item>
            <Descriptions.Item label="Seller ID">{activeReview.sellerId || '-'}</Descriptions.Item>
            <Descriptions.Item label="Điểm">{activeReview.rating}</Descriptions.Item>
            <Descriptions.Item label="Tiêu đề">{activeReview.title || '-'}</Descriptions.Item>
            <Descriptions.Item label="Nội dung">{activeReview.content || '-'}</Descriptions.Item>
            <Descriptions.Item label="Nguồn">{activeReview.sourceType}</Descriptions.Item>
            <Descriptions.Item label="Source Review ID">{activeReview.sourceReviewId || '-'}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái"><StatusTag status={activeReview.status} /></Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">{formatDateTime(activeReview.createdAt)}</Descriptions.Item>
            <Descriptions.Item label="Cập nhật">{formatDateTime(activeReview.updatedAt)}</Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </div>
  );
}
