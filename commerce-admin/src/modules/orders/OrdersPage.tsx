import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert, Button, Card, Descriptions, Drawer, Form, Input, InputNumber, Modal, Select, Space, Tag } from 'antd';
import { EyeOutlined, PlusOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { fetchBuyers } from '@/modules/buyers/buyer.api';
import { fetchProducts } from '@/modules/products/product.api';
import { fetchSellers } from '@/modules/sellers/seller.api';
import { DataPageHeader } from '@/shared/components/DataPageHeader';
import { StatusTag } from '@/shared/components/StatusTag';
import { CoreTable } from '@/shared/components/CoreTable';
import { useModalState, useNotification } from '@/shared/hooks';
import { extractErrorMessage } from '@/shared/utils/error-handler';
import { formatCurrency, formatDateTime } from '@/shared/utils/formatters';
import { createOrder, fetchOrderDetail, fetchOrders } from './order.api';
import type { Order, OrderDetail, OrderItemPayload, OrderPayload } from './order.types';

const DEFAULT_PAGE_SIZE = 20;
const orderStatusOptions = [
  { value: 'PENDING', label: 'PENDING' },
  { value: 'CONFIRMED', label: 'CONFIRMED' },
  { value: 'COMPLETED', label: 'COMPLETED' },
  { value: 'CANCELLED', label: 'CANCELLED' },
];
const paymentStatusOptions = [
  { value: 'PENDING', label: 'PENDING' },
  { value: 'PAID', label: 'PAID' },
  { value: 'FAILED', label: 'FAILED' },
  { value: 'REFUNDED', label: 'REFUNDED' },
];

interface OrderFormValues extends Omit<OrderPayload, 'items'> {
  items: OrderItemPayload[];
}

export function OrdersPage() {
  const notify = useNotification();
  const queryClient = useQueryClient();
  const [orderForm] = Form.useForm<OrderFormValues>();
  const [statusFilter, setStatusFilter] = useState<string>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const orderModal = useModalState();
  const detailDrawer = useModalState<Order>();

  const ordersQuery = useQuery({
    queryKey: ['cms-orders', statusFilter, page, pageSize],
    queryFn: () => fetchOrders({ status: statusFilter, page, pageSize }),
  });
  const sellersQuery = useQuery({
    queryKey: ['cms-sellers', 'order-options'],
    queryFn: () => fetchSellers({ status: 'ACTIVE', pageSize: 200 }),
  });
  const buyersQuery = useQuery({
    queryKey: ['cms-buyers', 'order-options'],
    queryFn: () => fetchBuyers({ status: 'ACTIVE', pageSize: 200 }),
  });
  const productsQuery = useQuery({
    queryKey: ['cms-products', 'order-options'],
    queryFn: () => fetchProducts({ status: 'ACTIVE', pageSize: 200 }),
  });
  const orderDetailQuery = useQuery({
    queryKey: ['cms-order-detail', detailDrawer.data?.id],
    queryFn: () => fetchOrderDetail(detailDrawer.data?.id as string),
    enabled: detailDrawer.open && Boolean(detailDrawer.data?.id),
  });

  const createMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: async () => {
      notify.success('Đã tạo đơn hàng.');
      orderForm.resetFields();
      orderModal.hideModal();
      await queryClient.invalidateQueries({ queryKey: ['cms-orders'] });
    },
    onError: (error) => notify.error(error, 'Tạo đơn hàng thất bại.'),
  });

  const sellerOptions = sellersQuery.data?.items.map((seller) => ({ value: seller.id, label: seller.name })) ?? [];
  const buyerOptions = buyersQuery.data?.items.map((buyer) => ({ value: buyer.id, label: `${buyer.displayName} (${buyer.email})` })) ?? [];
  const productOptions = productsQuery.data?.items.map((product) => ({ value: product.id, label: product.title })) ?? [];
  const sellerNameById = useMemo(() => new Map((sellersQuery.data?.items ?? []).map((seller) => [seller.id, seller.name])), [sellersQuery.data?.items]);
  const buyerNameById = useMemo(() => new Map((buyersQuery.data?.items ?? []).map((buyer) => [buyer.id, buyer.displayName])), [buyersQuery.data?.items]);
  const productNameById = useMemo(() => new Map((productsQuery.data?.items ?? []).map((product) => [product.id, product.title])), [productsQuery.data?.items]);
  const activeOrder = orderDetailQuery.data ?? detailDrawer.data;

  function openCreateModal() {
    orderForm.resetFields();
    orderForm.setFieldsValue({
      status: 'PENDING',
      paymentStatus: 'PENDING',
      currency: 'VND',
      items: [{ quantity: 1, unitPrice: 0 } as OrderItemPayload],
    });
    orderModal.showModal();
  }

  function handleSubmit(values: OrderFormValues) {
    createMutation.mutate({
      buyerId: values.buyerId,
      sellerId: values.sellerId,
      status: values.status ?? 'PENDING',
      paymentStatus: values.paymentStatus ?? 'PENDING',
      currency: values.currency || 'VND',
      items: values.items.map((item) => ({
        productId: item.productId,
        variantId: item.variantId || null,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
    });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, gap: 20 }}>
      <DataPageHeader
        title="Quản Lý Đơn Hàng"
        description="Theo dõi đơn hàng cơ bản phục vụ CMS và analytics."
        onRefresh={() => ordersQuery.refetch()}
        actions={
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
            Tạo Đơn Hàng
          </Button>
        }
      />

      {ordersQuery.isError && (
        <Alert type="error" showIcon message="Không tải được danh sách đơn hàng" description={extractErrorMessage(ordersQuery.error)} />
      )}

      <Card style={{ borderRadius: 12, flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }} bodyStyle={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, padding: 20 }}>
        <div style={{ marginBottom: 20 }}>
          <Select
            allowClear
            placeholder="Trạng thái đơn"
            value={statusFilter}
            options={orderStatusOptions}
            onChange={(value) => {
              setStatusFilter(value);
              setPage(1);
            }}
            style={{ width: 180 }}
          />
        </div>
        <CoreTable<Order>
          dataSource={ordersQuery.data?.items ?? []}
          rowKey="id"
          loading={ordersQuery.isLoading}
          pagination={{
            current: ordersQuery.data?.page ?? page,
            pageSize: ordersQuery.data?.pageSize ?? pageSize,
            total: ordersQuery.data?.total ?? 0,
            showSizeChanger: true,
            onChange: (nextPage, nextPageSize) => {
              setPage(nextPage);
              setPageSize(nextPageSize);
            },
          }}
          columns={[
            { title: 'Mã đơn', dataIndex: 'id', width: 130, render: (id: string) => <Tag color="blue">{id.slice(0, 8)}</Tag> },
            { title: 'Buyer', dataIndex: 'buyerId', width: 180, render: (id: string) => buyerNameById.get(id) ?? id.slice(0, 8) },
            { title: 'Seller', dataIndex: 'sellerId', width: 180, render: (id: string) => sellerNameById.get(id) ?? id.slice(0, 8) },
            { title: 'Tổng tiền', dataIndex: 'totalAmount', width: 160, render: (value: string) => <strong>{formatCurrency(value)}</strong> },
            { title: 'Thanh toán', dataIndex: 'paymentStatus', width: 140, render: (status: string) => <StatusTag status={status} /> },
            { title: 'Ngày đặt', dataIndex: 'orderedAt', width: 180, render: (value: string) => formatDateTime(value) },
            { title: 'Trạng thái', dataIndex: 'status', width: 130, render: (status: string) => <StatusTag status={status} /> },
            { title: 'Thao tác', key: 'actions', fixed: 'right', width: 120, render: (_, record) => <Button type="text" icon={<EyeOutlined style={{ color: '#2563eb' }} />} onClick={() => detailDrawer.showModal(record)}>Chi tiết</Button> },
          ]}
        />
      </Card>

      <Modal
        open={orderModal.open}
        title="Tạo đơn hàng"
        okText="Tạo đơn"
        cancelText="Hủy"
        confirmLoading={createMutation.isPending}
        onOk={() => orderForm.submit()}
        onCancel={orderModal.hideModal}
        destroyOnHidden
        width={760}
      >
        <Form<OrderFormValues> form={orderForm} layout="vertical" onFinish={handleSubmit}>
          <Space size={16} style={{ width: '100%' }} align="start">
            <Form.Item name="buyerId" label="Buyer" rules={[{ required: true, message: 'Chọn buyer.' }]} style={{ flex: 1 }}>
              <Select showSearch optionFilterProp="label" options={buyerOptions} loading={buyersQuery.isLoading} />
            </Form.Item>
            <Form.Item name="sellerId" label="Seller" rules={[{ required: true, message: 'Chọn seller.' }]} style={{ flex: 1 }}>
              <Select showSearch optionFilterProp="label" options={sellerOptions} loading={sellersQuery.isLoading} />
            </Form.Item>
          </Space>
          <Space size={16} style={{ width: '100%' }} align="start">
            <Form.Item name="status" label="Trạng thái" style={{ flex: 1 }}>
              <Select options={orderStatusOptions} />
            </Form.Item>
            <Form.Item name="paymentStatus" label="Thanh toán" style={{ flex: 1 }}>
              <Select options={paymentStatusOptions} />
            </Form.Item>
            <Form.Item name="currency" label="Tiền tệ" style={{ flex: 1 }}>
              <Select options={[{ value: 'VND', label: 'VND' }, { value: 'USD', label: 'USD' }]} />
            </Form.Item>
          </Space>

          <Form.List name="items">
            {(fields, { add, remove }) => (
              <Space direction="vertical" style={{ width: '100%' }}>
                {fields.map((field) => (
                  <Card key={field.key} size="small" title={`Sản phẩm #${field.name + 1}`} extra={fields.length > 1 ? <Button type="link" danger onClick={() => remove(field.name)}>Xóa</Button> : null}>
                    <Form.Item name={[field.name, 'productId']} label="Sản phẩm" rules={[{ required: true, message: 'Chọn sản phẩm.' }]}>
                      <Select showSearch optionFilterProp="label" options={productOptions} loading={productsQuery.isLoading} />
                    </Form.Item>
                    <Form.Item name={[field.name, 'variantId']} label="Variant ID">
                      <Input allowClear placeholder="Tùy chọn" />
                    </Form.Item>
                    <Space size={16} style={{ width: '100%' }} align="start">
                      <Form.Item name={[field.name, 'quantity']} label="Số lượng" rules={[{ required: true, message: 'Nhập số lượng.' }]} style={{ flex: 1 }}>
                        <InputNumber min={1} precision={0} style={{ width: '100%' }} />
                      </Form.Item>
                      <Form.Item name={[field.name, 'unitPrice']} label="Đơn giá" rules={[{ required: true, message: 'Nhập đơn giá.' }]} style={{ flex: 1 }}>
                        <InputNumber min={0} style={{ width: '100%' }} />
                      </Form.Item>
                    </Space>
                  </Card>
                ))}
                <Button icon={<PlusOutlined />} onClick={() => add({ quantity: 1, unitPrice: 0 })}>
                  Thêm dòng sản phẩm
                </Button>
              </Space>
            )}
          </Form.List>
        </Form>
      </Modal>

      <Drawer title="Chi tiết đơn hàng" open={detailDrawer.open} onClose={detailDrawer.hideModal} width={620}>
        {orderDetailQuery.isError && <Alert type="error" showIcon message="Không tải được chi tiết" description={extractErrorMessage(orderDetailQuery.error)} />}
        {activeOrder && (
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Mã đơn">{activeOrder.id}</Descriptions.Item>
              <Descriptions.Item label="Buyer">{buyerNameById.get(activeOrder.buyerId) ?? activeOrder.buyerId}</Descriptions.Item>
              <Descriptions.Item label="Seller">{sellerNameById.get(activeOrder.sellerId) ?? activeOrder.sellerId}</Descriptions.Item>
              <Descriptions.Item label="Tổng tiền">{formatCurrency(activeOrder.totalAmount)}</Descriptions.Item>
              <Descriptions.Item label="Tiền tệ">{activeOrder.currency}</Descriptions.Item>
              <Descriptions.Item label="Thanh toán"><StatusTag status={activeOrder.paymentStatus} /></Descriptions.Item>
              <Descriptions.Item label="Trạng thái"><StatusTag status={activeOrder.status} /></Descriptions.Item>
              <Descriptions.Item label="Ngày đặt">{formatDateTime(activeOrder.orderedAt)}</Descriptions.Item>
            </Descriptions>
            {'items' in activeOrder && (
              <CoreTable<OrderDetail['items'][number]>
                dataSource={activeOrder.items as OrderDetail['items']}
                rowKey="id"
                pagination={false}
                scrollY={undefined}
                columns={[
                  { title: 'Sản phẩm', dataIndex: 'productId', render: (id: string) => productNameById.get(id) ?? id },
                  { title: 'Variant', dataIndex: 'variantId', render: (id: string | null) => id || '-' },
                  { title: 'SL', dataIndex: 'quantity' },
                  { title: 'Đơn giá', dataIndex: 'unitPrice', render: formatCurrency },
                  { title: 'Thành tiền', dataIndex: 'totalPrice', render: formatCurrency },
                ]}
              />
            )}
          </Space>
        )}
      </Drawer>
    </div>
  );
}
