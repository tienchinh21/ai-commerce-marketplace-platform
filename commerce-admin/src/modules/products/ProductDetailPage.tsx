import { useQuery } from '@tanstack/react-query';
import { Alert, Card, Descriptions, Image, Space, Spin, Table, Tag, Typography } from 'antd';
import { useParams } from 'react-router-dom';
import { DataPageHeader } from '@/shared/components/DataPageHeader';
import { StatusTag } from '@/shared/components/StatusTag';
import { ROUTES } from '@/shared/constants/routes.constants';
import { extractErrorMessage } from '@/shared/utils/error-handler';
import { formatCurrency, formatDateTime } from '@/shared/utils/formatters';
import { fetchProductDetail } from './product.api';
import type { ProductImage, ProductVariant } from './product.types';

export function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const productQuery = useQuery({
    queryKey: ['cms-product-detail', productId],
    queryFn: () => fetchProductDetail(productId as string),
    enabled: Boolean(productId),
  });

  const product = productQuery.data;

  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <DataPageHeader
        title="Chi Tiết Sản Phẩm"
        description="Chi tiết product, variants, images, specs và reviews."
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
          <Card style={{ borderRadius: 12, border: '1px solid #e2e8f0' }}>
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="Tên sản phẩm" span={2}>{product.title}</Descriptions.Item>
              <Descriptions.Item label="Thương hiệu">{product.brand || '-'}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái"><StatusTag status={product.status} /></Descriptions.Item>
              <Descriptions.Item label="Seller ID"><Typography.Text copyable>{product.sellerId}</Typography.Text></Descriptions.Item>
              <Descriptions.Item label="Category ID"><Typography.Text copyable>{product.categoryId}</Typography.Text></Descriptions.Item>
              <Descriptions.Item label="Giá thấp nhất">{formatCurrency(product.priceMin)}</Descriptions.Item>
              <Descriptions.Item label="Giá cao nhất">{formatCurrency(product.priceMax)}</Descriptions.Item>
              <Descriptions.Item label="Rating">{product.ratingAvg}</Descriptions.Item>
              <Descriptions.Item label="Số review">{product.reviewCount}</Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">{formatDateTime(product.createdAt)}</Descriptions.Item>
              <Descriptions.Item label="Cập nhật">{formatDateTime(product.updatedAt)}</Descriptions.Item>
              <Descriptions.Item label="Mô tả" span={2}>{product.description || '-'}</Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="Biến thể sản phẩm" style={{ borderRadius: 12, border: '1px solid #e2e8f0' }}>
            <Table<ProductVariant>
              dataSource={product.variants}
              rowKey="id"
              pagination={false}
              columns={[
                { title: 'SKU', dataIndex: 'sku', render: (sku: string) => <Typography.Text copyable>{sku}</Typography.Text> },
                { title: 'Tên biến thể', dataIndex: 'title', render: (title: string | null) => title || '-' },
                { title: 'Giá', dataIndex: 'price', render: (price: string) => <strong>{formatCurrency(price)}</strong> },
                { title: 'Tồn kho', dataIndex: 'stockQuantity' },
                { title: 'Trạng thái', dataIndex: 'status', render: (status: string) => <StatusTag status={status} /> },
              ]}
            />
          </Card>

          <Card title="Hình ảnh sản phẩm" style={{ borderRadius: 12, border: '1px solid #e2e8f0' }}>
            <Table<ProductImage>
              dataSource={product.images}
              rowKey="id"
              pagination={false}
              columns={[
                { title: 'Ảnh', dataIndex: 'url', render: (url: string, record) => <Image width={64} src={url} alt={record.altText || product.title} /> },
                { title: 'Alt text', dataIndex: 'altText', render: (altText: string | null) => altText || '-' },
                { title: 'Thứ tự', dataIndex: 'sortOrder' },
                { title: 'Ngày tạo', dataIndex: 'createdAt', render: (createdAt: string) => formatDateTime(createdAt) },
              ]}
            />
          </Card>

          <Card title="Specs JSON" style={{ borderRadius: 12, border: '1px solid #e2e8f0' }}>
            {Object.keys(product.specsJson).length > 0 ? (
              <Space wrap>
                {Object.entries(product.specsJson).map(([key, value]) => (
                  <Tag key={key} color="blue">
                    {key}: {String(value)}
                  </Tag>
                ))}
              </Space>
            ) : (
              <Typography.Text type="secondary">Chưa có thông số kỹ thuật.</Typography.Text>
            )}
          </Card>
        </>
      )}
    </Space>
  );
}
