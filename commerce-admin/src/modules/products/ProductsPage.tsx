import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert, Badge, Button, Card, Input, Rate, Space, Tag } from 'antd';
import { DeleteOutlined, EyeOutlined, PlusOutlined, SearchOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { DataPageHeader } from '@/shared/components/DataPageHeader';
import { StatusTag } from '@/shared/components/StatusTag';
import { ConfirmModal } from '@/shared/components/ConfirmModal';
import { CoreTable } from '@/shared/components/CoreTable';
import { formatCurrency } from '@/shared/utils/formatters';
import { extractErrorMessage } from '@/shared/utils/error-handler';
import { useDebounce, useModalState, useNotification } from '@/shared/hooks';
import { ROUTES } from '@/shared/constants/routes.constants';
import { deleteProduct, fetchProducts } from './product.api';
import type { Product } from './product.types';

const DEFAULT_PAGE_SIZE = 20;

export function ProductsPage() {
  const navigate = useNavigate();
  const notify = useNotification();
  const queryClient = useQueryClient();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const debouncedKeyword = useDebounce(searchKeyword, 300);
  const deleteModal = useModalState<Product>();

  const productsQuery = useQuery({
    queryKey: ['cms-products', debouncedKeyword, page, pageSize],
    queryFn: () =>
      fetchProducts({
        search: debouncedKeyword.trim() || undefined,
        page,
        pageSize,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: async () => {
      notify.success('Đã xóa sản phẩm thành công.');
      deleteModal.hideModal();
      await queryClient.invalidateQueries({ queryKey: ['cms-products'] });
    },
    onError: (error) => {
      notify.error(extractErrorMessage(error, 'Xóa sản phẩm thất bại.'));
    },
  });

  const products = productsQuery.data?.items ?? [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, gap: 20 }}>
      <DataPageHeader
        title="Quản Lý Sản Phẩm (Catalog Products)"
        description="Quản lý thông tin sản phẩm chuẩn hóa (Canonical Products), biến thể, hình ảnh và thuộc tính kỹ thuật specs_json."
        onRefresh={() => productsQuery.refetch()}
      />

      {productsQuery.isError && (
        <Alert
          type="error"
          showIcon
          message="Không tải được danh sách sản phẩm"
          description={extractErrorMessage(productsQuery.error)}
        />
      )}

      <Card style={{ borderRadius: 12, border: '1px solid #e2e8f0', flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }} bodyStyle={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, padding: 20 }}>
        <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Input
            prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
            placeholder="Tìm theo tên sản phẩm, thương hiệu..."
            value={searchKeyword}
            onChange={(event) => {
              setSearchKeyword(event.target.value);
              setPage(1);
            }}
            style={{ width: 340, borderRadius: 8 }}
            allowClear
          />
          <Button type="primary" icon={<PlusOutlined />} style={{ background: '#2563eb', fontWeight: 600 }}>
            Tạo Sản Phẩm Mới
          </Button>
        </div>

        <CoreTable<Product>
          dataSource={products}
          rowKey="id"
          loading={productsQuery.isLoading || deleteMutation.isPending}
          pagination={{
            current: productsQuery.data?.page ?? page,
            pageSize: productsQuery.data?.pageSize ?? pageSize,
            total: productsQuery.data?.total ?? 0,
            showSizeChanger: true,
            onChange: (nextPage, nextPageSize) => {
              setPage(nextPage);
              setPageSize(nextPageSize);
            },
          }}
          columns={[
            {
              title: 'Sản phẩm',
              dataIndex: 'title',
              render: (title: string, record) => (
                <Space>
                  <div style={{ width: 38, height: 38, borderRadius: 8, background: '#f1f5f9', display: 'grid', placeItems: 'center', color: '#6366f1' }}>
                    <ShoppingOutlined />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{title}</div>
                    <Tag color="cyan" style={{ fontSize: 11 }}>Hãng: {record.brand || '-'}</Tag>
                  </div>
                </Space>
              ),
            },
            { title: 'Danh mục', dataIndex: 'categoryId', render: (categoryId: string) => <Tag color="blue">{categoryId.slice(0, 8)}</Tag> },
            {
              title: 'Giá hiển thị',
              key: 'price',
              render: (_, record) => (
                <span style={{ fontWeight: 700, color: '#16a34a' }}>
                  {formatCurrency(record.priceMin)}
                  {record.priceMax !== record.priceMin ? ` - ${formatCurrency(record.priceMax)}` : ''}
                </span>
              ),
            },
            {
              title: 'Đánh giá & Phản hồi',
              key: 'rating',
              render: (_, record) => {
                const rating = Number.parseFloat(record.ratingAvg);
                return (
                  <Space>
                    <Rate disabled defaultValue={Number.isFinite(rating) ? rating : 0} style={{ fontSize: 13 }} />
                    <span style={{ fontWeight: 600 }}>{Number.isFinite(rating) ? rating.toFixed(1) : '0.0'}</span>
                    <Badge count={`${record.reviewCount} review`} style={{ backgroundColor: '#e2e8f0', color: '#475569' }} />
                  </Space>
                );
              },
            },
            { title: 'Trạng thái', dataIndex: 'status', render: (status: string) => <StatusTag status={status} /> },
            {
              title: 'Thao tác',
              key: 'action',
              render: (_, record) => (
                <Space size={4}>
                  <Button
                    type="text"
                    icon={<EyeOutlined style={{ color: '#2563eb' }} />}
                    onClick={() => navigate(ROUTES.PRODUCT_DETAIL(record.id))}
                  >
                    Chi tiết
                  </Button>
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => deleteModal.showModal(record)}
                  >
                    Xóa
                  </Button>
                </Space>
              ),
            },
          ]}
        />
      </Card>

      <ConfirmModal
        open={deleteModal.open}
        title="Xác nhận xóa sản phẩm"
        content={`Bạn có chắc chắn muốn xóa sản phẩm "${deleteModal.data?.title}" khỏi catalog không? Thao tác này không thể hoàn tác.`}
        onConfirm={() => {
          if (deleteModal.data) {
            deleteMutation.mutate(deleteModal.data.id);
          }
        }}
        onCancel={deleteModal.hideModal}
        danger
        okText="Xóa sản phẩm"
      />
    </div>
  );
}
