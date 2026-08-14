import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert, Badge, Button, Card, Form, Input, InputNumber, Modal, Rate, Select, Space, Tag } from 'antd';
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { DataPageHeader } from '@/shared/components/DataPageHeader';
import { StatusTag } from '@/shared/components/StatusTag';
import { ConfirmModal } from '@/shared/components/ConfirmModal';
import { CoreTable } from '@/shared/components/CoreTable';
import { formatCurrency } from '@/shared/utils/formatters';
import { extractErrorMessage } from '@/shared/utils/error-handler';
import { useDebounce, useModalState, useNotification } from '@/shared/hooks';
import { ROUTES } from '@/shared/constants/routes.constants';
import { fetchCategories } from '@/modules/categories/category.api';
import { fetchSellers } from '@/modules/sellers/seller.api';
import {
  createProduct,
  deleteProduct,
  fetchProductDetail,
  fetchProducts,
  updateProduct,
} from './product.api';
import type { Product, ProductPayload } from './product.types';

const DEFAULT_PAGE_SIZE = 20;
const statusOptions = [
  { value: 'ACTIVE', label: 'ACTIVE' },
  { value: 'INACTIVE', label: 'INACTIVE' },
  { value: 'DRAFT', label: 'DRAFT' },
];

type ProductFormValues = Omit<ProductPayload, 'specsJson'>;

export function ProductsPage() {
  const navigate = useNavigate();
  const notify = useNotification();
  const queryClient = useQueryClient();
  const [productForm] = Form.useForm<ProductFormValues>();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>();
  const [categoryFilter, setCategoryFilter] = useState<string>();
  const [sellerFilter, setSellerFilter] = useState<string>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const debouncedKeyword = useDebounce(searchKeyword, 300);
  const deleteModal = useModalState<Product>();
  const productModal = useModalState<Product>();

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const sellersQuery = useQuery({
    queryKey: ['cms-sellers', 'product-options'],
    queryFn: () => fetchSellers({ status: 'ACTIVE', pageSize: 200 }),
  });

  const productsQuery = useQuery({
    queryKey: ['cms-products', debouncedKeyword, statusFilter, categoryFilter, sellerFilter, page, pageSize],
    queryFn: () =>
      fetchProducts({
        search: debouncedKeyword.trim() || undefined,
        status: statusFilter,
        categoryId: categoryFilter,
        sellerId: sellerFilter,
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

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: async () => {
      notify.success('Đã tạo sản phẩm thành công.');
      productForm.resetFields();
      productModal.hideModal();
      await queryClient.invalidateQueries({ queryKey: ['cms-products'] });
    },
    onError: (error) => {
      notify.error(error, 'Tạo sản phẩm thất bại.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ProductPayload }) => updateProduct(id, payload),
    onSuccess: async () => {
      notify.success('Đã cập nhật sản phẩm thành công.');
      productForm.resetFields();
      productModal.hideModal();
      await queryClient.invalidateQueries({ queryKey: ['cms-products'] });
    },
    onError: (error) => {
      notify.error(error, 'Cập nhật sản phẩm thất bại.');
    },
  });

  const products = productsQuery.data?.items ?? [];
  const sellerOptions = sellersQuery.data?.items.map((seller) => ({ value: seller.id, label: seller.name })) ?? [];
  const categoryOptions = categoriesQuery.data?.map((category) => ({ value: category.id, label: category.name })) ?? [];
  const sellerLookup = useMemo(
    () => new Map((sellersQuery.data?.items ?? []).map((seller) => [seller.id, seller.name])),
    [sellersQuery.data?.items],
  );
  const categoryLookup = useMemo(
    () => new Map((categoriesQuery.data ?? []).map((category) => [category.id, category.name])),
    [categoriesQuery.data],
  );
  const isEditing = Boolean(productModal.data);
  const productMutationPending = createMutation.isPending || updateMutation.isPending;

  function openCreateModal() {
    productForm.resetFields();
    productForm.setFieldsValue({ status: 'ACTIVE' });
    productModal.showModal();
  }

  async function openEditModal(product: Product) {
    // Lấy chi tiết sản phẩm để điền đầy đủ description/specs (API danh sách không trả về các trường này)
    let detail;
    try {
      detail = await fetchProductDetail(product.id);
    } catch (error) {
      notify.error(error, 'Không tải được chi tiết sản phẩm.');
      return;
    }
    productForm.setFieldsValue({
      sellerId: detail.sellerId,
      categoryId: detail.categoryId,
      title: detail.title,
      slug: detail.slug,
      brand: detail.brand ?? undefined,
      description: detail.description ?? undefined,
      status: detail.status,
      priceMin: Number(detail.priceMin),
      priceMax: Number(detail.priceMax),
    });
    productModal.showModal(product);
  }

  function handleSubmitProduct(values: ProductFormValues) {
    const payload: ProductPayload = {
      sellerId: values.sellerId,
      categoryId: values.categoryId,
      title: values.title,
      slug: values.slug || undefined,
      brand: values.brand || null,
      description: values.description || null,
      status: values.status ?? 'ACTIVE',
      priceMin: values.priceMin,
      priceMax: values.priceMax,
    };

    if (productModal.data) {
      updateMutation.mutate({ id: productModal.data.id, payload });
      return;
    }
    createMutation.mutate(payload);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, gap: 20 }}>
      <DataPageHeader
        title="Quản Lý Sản Phẩm (Catalog Products)"
        description="Quản lý thông tin sản phẩm chuẩn hóa, biến thể và hình ảnh. Thuộc tính kỹ thuật nội bộ được xử lý qua dữ liệu ngành hàng/import."
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

      <Card style={{ borderRadius: 12, flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }} bodyStyle={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, padding: 20 }}>
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
          <Space>
            <Select
              allowClear
              showSearch
              placeholder="Shop"
              value={sellerFilter}
              options={sellerOptions}
              loading={sellersQuery.isLoading}
              optionFilterProp="label"
              onChange={(value) => {
                setSellerFilter(value);
                setPage(1);
              }}
              style={{ width: 220 }}
            />
            <Select
              allowClear
              showSearch
              placeholder="Danh mục"
              value={categoryFilter}
              options={categoryOptions}
              loading={categoriesQuery.isLoading}
              optionFilterProp="label"
              onChange={(value) => {
                setCategoryFilter(value);
                setPage(1);
              }}
              style={{ width: 220 }}
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
              style={{ width: 140 }}
            />
          </Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={openCreateModal}
            style={{ background: '#2563eb', fontWeight: 600 }}
          >
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
              width: 260,
              render: (title: string, record) => (
                <div>
                  <div style={{ fontWeight: 600 }}>{title}</div>
                  <Tag color="cyan" style={{ fontSize: 11, marginTop: 4 }}>Hãng: {record.brand || '-'}</Tag>
                </div>
              ),
            },
            {
              title: 'Shop',
              dataIndex: 'sellerId',
              width: 150,
              render: (sellerId: string) => (
                <Tag color="geekblue">{sellerLookup.get(sellerId) ?? sellerId.slice(0, 8)}</Tag>
              ),
            },
            {
              title: 'Danh mục',
              dataIndex: 'categoryId',
              width: 160,
              render: (categoryId: string) => (
                <Tag color="blue">{categoryLookup.get(categoryId) ?? categoryId.slice(0, 8)}</Tag>
              ),
            },
            {
              title: 'Giá hiển thị',
              key: 'price',
              width: 190,
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
              width: 230,
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
            { title: 'Trạng thái', dataIndex: 'status', width: 130, render: (status: string) => <StatusTag status={status} /> },
            {
              title: 'Thao tác',
              key: 'actions',
              fixed: 'right',
              width: 200,
              render: (_, record) => (
                <Space size={4}>
                  <Button
                    type="text"
                    icon={<EditOutlined style={{ color: '#0284c7' }} />}
                    onClick={() => openEditModal(record)}
                  >
                    Sửa
                  </Button>
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

      <Modal
        open={productModal.open}
        title={isEditing ? 'Cập nhật sản phẩm' : 'Tạo sản phẩm mới'}
        okText={isEditing ? 'Cập nhật' : 'Tạo sản phẩm'}
        cancelText="Hủy"
        confirmLoading={productMutationPending}
        onOk={() => productForm.submit()}
        onCancel={productModal.hideModal}
        destroyOnHidden
        width={720}
      >
        <Form<ProductFormValues>
          form={productForm}
          layout="vertical"
          onFinish={handleSubmitProduct}
        >
          <Space size={16} style={{ width: '100%' }} align="start">
            <Form.Item name="sellerId" label="Shop" rules={[{ required: true, message: 'Chọn shop.' }]} style={{ flex: 1 }}>
              <Select showSearch options={sellerOptions} loading={sellersQuery.isLoading} optionFilterProp="label" />
            </Form.Item>
            <Form.Item name="categoryId" label="Danh mục" rules={[{ required: true, message: 'Chọn danh mục.' }]} style={{ flex: 1 }}>
              <Select showSearch options={categoryOptions} loading={categoriesQuery.isLoading} optionFilterProp="label" />
            </Form.Item>
          </Space>
          <Form.Item name="title" label="Tên sản phẩm" rules={[{ required: true, message: 'Nhập tên sản phẩm.' }]}>
            <Input />
          </Form.Item>
          <Space size={16} style={{ width: '100%' }} align="start">
            <Form.Item name="slug" label="Slug" style={{ flex: 1 }}>
              <Input />
            </Form.Item>
            <Form.Item name="brand" label="Thương hiệu" style={{ flex: 1 }}>
              <Input />
            </Form.Item>
          </Space>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Space size={16} style={{ width: '100%' }} align="start">
            <Form.Item name="priceMin" label="Giá thấp nhất" style={{ flex: 1 }}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="priceMax" label="Giá cao nhất" style={{ flex: 1 }}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="status" label="Trạng thái" style={{ flex: 1 }}>
              <Select options={statusOptions} />
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </div>
  );
}
