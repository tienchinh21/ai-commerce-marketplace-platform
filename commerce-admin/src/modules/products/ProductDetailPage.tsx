import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert, Button, Card, Descriptions, Form, Image, Input, InputNumber, Modal, Select, Space, Spin, Tag, Typography } from 'antd';
import { PictureOutlined, PlusOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { DataPageHeader } from '@/shared/components/DataPageHeader';
import { StatusTag } from '@/shared/components/StatusTag';
import { CoreTable } from '@/shared/components/CoreTable';
import { ROUTES } from '@/shared/constants/routes.constants';
import { extractErrorMessage } from '@/shared/utils/error-handler';
import { formatCurrency, formatDateTime } from '@/shared/utils/formatters';
import { useModalState, useNotification } from '@/shared/hooks';
import { addProductImages, createProductVariant, fetchProductDetail } from './product.api';
import type { ProductImage, ProductVariant } from './product.types';

interface VariantFormValues {
  sku: string;
  title?: string;
  price: number;
  stockQuantity?: number;
  status?: string;
}

interface ImageFormValues {
  url: string;
  altText?: string;
  sortOrder?: number;
}

export function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const queryClient = useQueryClient();
  const notify = useNotification();
  const variantModal = useModalState();
  const imageModal = useModalState();
  const [variantForm] = Form.useForm<VariantFormValues>();
  const [imageForm] = Form.useForm<ImageFormValues>();

  const productQuery = useQuery({
    queryKey: ['cms-product-detail', productId],
    queryFn: () => fetchProductDetail(productId as string),
    enabled: Boolean(productId),
  });

  const refreshProductDetail = async () => {
    await queryClient.invalidateQueries({ queryKey: ['cms-product-detail', productId] });
  };

  const createVariantMutation = useMutation({
    mutationFn: (values: VariantFormValues) =>
      createProductVariant(productId as string, {
        ...values,
        title: values.title || null,
        stockQuantity: values.stockQuantity ?? 0,
        status: values.status ?? 'ACTIVE',
      }),
    onSuccess: async () => {
      notify.success('Đã thêm biến thể sản phẩm.');
      variantForm.resetFields();
      variantModal.hideModal();
      await refreshProductDetail();
    },
    onError: (error) => {
      notify.error(error, 'Thêm biến thể thất bại.');
    },
  });

  const addImageMutation = useMutation({
    mutationFn: (values: ImageFormValues) =>
      addProductImages(productId as string, {
        images: [
          {
            url: values.url,
            altText: values.altText || null,
            sortOrder: values.sortOrder,
          },
        ],
      }),
    onSuccess: async () => {
      notify.success('Đã thêm hình ảnh sản phẩm.');
      imageForm.resetFields();
      imageModal.hideModal();
      await refreshProductDetail();
    },
    onError: (error) => {
      notify.error(error, 'Thêm hình ảnh thất bại.');
    },
  });

  const product = productQuery.data;

  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <DataPageHeader
        title="Chi Tiết Sản Phẩm"
        description="Chi tiết product, variants và images. Thuộc tính kỹ thuật nội bộ được xử lý qua dữ liệu ngành hàng/import."
        breadcrumbs={[
          { title: 'Trang chủ', path: ROUTES.DASHBOARD },
          { title: 'Sản phẩm', path: ROUTES.PRODUCTS },
          { title: 'Chi tiết sản phẩm' },
        ]}
        onRefresh={() => productQuery.refetch()}
      />

      {productQuery.isLoading && <Spin />}

      {productQuery.isError && (
        <Alert
          type="error"
          showIcon
          message="Không tải được chi tiết sản phẩm"
          description={extractErrorMessage(productQuery.error)}
        />
      )}

      {product && (
        <>
          <Card style={{ borderRadius: 12 }}>
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="Tên sản phẩm" span={2}>{product.title}</Descriptions.Item>
              <Descriptions.Item label="Thương hiệu">{product.brand || '-'}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái"><StatusTag status={product.status} /></Descriptions.Item>
              <Descriptions.Item label="Shop">
                <Space direction="vertical" size={0}>
                  <Typography.Text strong>{product.seller?.name ?? '-'}</Typography.Text>
                  <Typography.Text type="secondary" copyable={{ text: product.sellerId }}>{product.sellerId}</Typography.Text>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Danh mục">
                <Space direction="vertical" size={0}>
                  <Typography.Text strong>{product.category?.name ?? '-'}</Typography.Text>
                  <Typography.Text type="secondary" copyable={{ text: product.categoryId }}>{product.categoryId}</Typography.Text>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Giá thấp nhất">{formatCurrency(product.priceMin)}</Descriptions.Item>
              <Descriptions.Item label="Giá cao nhất">{formatCurrency(product.priceMax)}</Descriptions.Item>
              <Descriptions.Item label="Rating">{product.ratingAvg}</Descriptions.Item>
              <Descriptions.Item label="Số review">{product.reviewCount}</Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">{formatDateTime(product.createdAt)}</Descriptions.Item>
              <Descriptions.Item label="Cập nhật">{formatDateTime(product.updatedAt)}</Descriptions.Item>
              <Descriptions.Item label="Mô tả" span={2}>{product.description || '-'}</Descriptions.Item>
            </Descriptions>
          </Card>

          <Card
            title="Biến thể sản phẩm"
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => variantModal.showModal()}
              >
                Thêm biến thể
              </Button>
            }
            style={{ borderRadius: 12 }}
          >
            <CoreTable<ProductVariant>
              dataSource={product.variants}
              rowKey="id"
              pagination={false}
              scrollY={undefined}
              columns={[
                { title: 'SKU', dataIndex: 'sku', render: (sku: string) => <Typography.Text copyable>{sku}</Typography.Text> },
                { title: 'Tên biến thể', dataIndex: 'title', render: (title: string | null) => title || '-' },
                { title: 'Giá', dataIndex: 'price', render: (price: string) => <strong>{formatCurrency(price)}</strong> },
                { title: 'Tồn kho', dataIndex: 'stockQuantity' },
                { title: 'Trạng thái', dataIndex: 'status', render: (status: string) => <StatusTag status={status} /> },
              ]}
            />
          </Card>

          <Card
            title="Hình ảnh sản phẩm"
            extra={
              <Button
                icon={<PictureOutlined />}
                onClick={() => imageModal.showModal()}
              >
                Thêm ảnh
              </Button>
            }
            style={{ borderRadius: 12 }}
          >
            <CoreTable<ProductImage>
              dataSource={product.images}
              rowKey="id"
              pagination={false}
              scrollY={undefined}
              columns={[
                { title: 'Ảnh', dataIndex: 'url', render: (url: string, record: ProductImage) => <Image width={64} src={url} alt={record.altText || product.title} /> },
                { title: 'Alt text', dataIndex: 'altText', render: (altText: string | null) => altText || '-' },
                { title: 'Thứ tự', dataIndex: 'sortOrder' },
                { title: 'Ngày tạo', dataIndex: 'createdAt', render: (createdAt: string) => formatDateTime(createdAt) },
              ]}
            />
          </Card>

        </>
      )}

      <Modal
        open={variantModal.open}
        title="Thêm biến thể sản phẩm"
        okText="Thêm biến thể"
        cancelText="Hủy"
        confirmLoading={createVariantMutation.isPending}
        onOk={() => variantForm.submit()}
        onCancel={variantModal.hideModal}
        destroyOnHidden
      >
        <Form<VariantFormValues>
          form={variantForm}
          layout="vertical"
          initialValues={{ status: 'ACTIVE', stockQuantity: 0 }}
          onFinish={(values) => createVariantMutation.mutate(values)}
        >
          <Form.Item name="sku" label="SKU" rules={[{ required: true, message: 'Nhập SKU.' }]}>
            <Input placeholder="SKU-12345" />
          </Form.Item>
          <Form.Item name="title" label="Tên biến thể">
            <Input placeholder="Tai nghe Anker - Đen" />
          </Form.Item>
          <Form.Item name="price" label="Giá" rules={[{ required: true, message: 'Nhập giá.' }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="stockQuantity" label="Tồn kho">
            <InputNumber min={0} precision={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="status" label="Trạng thái">
            <Select
              options={[
                { value: 'ACTIVE', label: 'ACTIVE' },
                { value: 'INACTIVE', label: 'INACTIVE' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={imageModal.open}
        title="Thêm hình ảnh sản phẩm"
        okText="Thêm ảnh"
        cancelText="Hủy"
        confirmLoading={addImageMutation.isPending}
        onOk={() => imageForm.submit()}
        onCancel={imageModal.hideModal}
        destroyOnHidden
      >
        <Form<ImageFormValues>
          form={imageForm}
          layout="vertical"
          onFinish={(values) => addImageMutation.mutate(values)}
        >
          <Form.Item name="url" label="URL ảnh" rules={[{ required: true, message: 'Nhập URL ảnh.' }]}>
            <Input placeholder="https://example.com/product.jpg" />
          </Form.Item>
          <Form.Item name="altText" label="Alt text">
            <Input placeholder={product?.title ?? 'Ảnh sản phẩm'} />
          </Form.Item>
          <Form.Item name="sortOrder" label="Thứ tự">
            <InputNumber min={0} precision={0} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
}
