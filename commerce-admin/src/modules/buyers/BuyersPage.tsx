import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert, Button, Card, Descriptions, Drawer, Form, Input, Modal, Select, Space, Tag } from 'antd';
import { EditOutlined, EyeOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { DataPageHeader } from '@/shared/components/DataPageHeader';
import { StatusTag } from '@/shared/components/StatusTag';
import { CoreTable } from '@/shared/components/CoreTable';
import { useDebounce, useModalState, useNotification } from '@/shared/hooks';
import { extractErrorMessage } from '@/shared/utils/error-handler';
import { formatDateTime } from '@/shared/utils/formatters';
import { parseJsonObject, stringifyJsonObject } from '@/shared/utils/json-object';
import { createBuyer, fetchBuyerDetail, fetchBuyers, updateBuyer } from './buyer.api';
import type { Buyer, BuyerPayload } from './buyer.types';

const DEFAULT_PAGE_SIZE = 20;
const statusOptions = [
  { value: 'ACTIVE', label: 'ACTIVE' },
  { value: 'INACTIVE', label: 'INACTIVE' },
];

interface BuyerFormValues extends Omit<BuyerPayload, 'metadataJson'> {
  metadataJsonText?: string;
}

export function BuyersPage() {
  const notify = useNotification();
  const queryClient = useQueryClient();
  const [buyerForm] = Form.useForm<BuyerFormValues>();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const debouncedKeyword = useDebounce(searchKeyword, 300);
  const buyerModal = useModalState<Buyer>();
  const detailDrawer = useModalState<Buyer>();

  const buyersQuery = useQuery({
    queryKey: ['cms-buyers', debouncedKeyword, page, pageSize],
    queryFn: () =>
      fetchBuyers({
        search: debouncedKeyword.trim() || undefined,
        page,
        pageSize,
      }),
  });

  const buyerDetailQuery = useQuery({
    queryKey: ['cms-buyer-detail', detailDrawer.data?.id],
    queryFn: () => fetchBuyerDetail(detailDrawer.data?.id as string),
    enabled: detailDrawer.open && Boolean(detailDrawer.data?.id),
  });

  const createMutation = useMutation({
    mutationFn: createBuyer,
    onSuccess: async () => {
      notify.success('Đã tạo khách hàng.');
      buyerForm.resetFields();
      buyerModal.hideModal();
      await queryClient.invalidateQueries({ queryKey: ['cms-buyers'] });
    },
    onError: (error) => notify.error(error, 'Tạo khách hàng thất bại.'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: BuyerPayload }) => updateBuyer(id, payload),
    onSuccess: async () => {
      notify.success('Đã cập nhật khách hàng.');
      buyerForm.resetFields();
      buyerModal.hideModal();
      await queryClient.invalidateQueries({ queryKey: ['cms-buyers'] });
    },
    onError: (error) => notify.error(error, 'Cập nhật khách hàng thất bại.'),
  });

  function openCreateModal() {
    buyerForm.resetFields();
    buyerForm.setFieldsValue({ status: 'ACTIVE', metadataJsonText: '{}' });
    buyerModal.showModal();
  }

  function openEditModal(buyer: Buyer) {
    buyerForm.setFieldsValue({
      email: buyer.email,
      displayName: buyer.displayName,
      phone: buyer.phone,
      status: buyer.status,
      userId: buyer.userId,
      metadataJsonText: stringifyJsonObject(buyer.metadataJson),
    });
    buyerModal.showModal(buyer);
  }

  function handleSubmit(values: BuyerFormValues) {
    let metadataJson: Record<string, unknown>;
    try {
      metadataJson = parseJsonObject(values.metadataJsonText);
    } catch (error) {
      notify.error(error, 'Metadata JSON không hợp lệ.');
      return;
    }

    const payload: BuyerPayload = {
      email: values.email,
      displayName: values.displayName,
      phone: values.phone || null,
      status: values.status ?? 'ACTIVE',
      userId: values.userId || null,
      metadataJson,
    };

    if (buyerModal.data) {
      updateMutation.mutate({ id: buyerModal.data.id, payload });
      return;
    }
    createMutation.mutate(payload);
  }

  const activeBuyer = buyerDetailQuery.data ?? detailDrawer.data;
  const isEditing = Boolean(buyerModal.data);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, gap: 20 }}>
      <DataPageHeader
        title="Quản Lý Khách Hàng (Buyers)"
        description="Danh sách người mua hàng, tài khoản liên kết và metadata chăm sóc khách hàng."
        onRefresh={() => buyersQuery.refetch()}
        actions={
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
            Thêm Khách Hàng
          </Button>
        }
      />

      {buyersQuery.isError && (
        <Alert type="error" showIcon message="Không tải được danh sách khách hàng" description={extractErrorMessage(buyersQuery.error)} />
      )}

      <Card style={{ borderRadius: 12, flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }} bodyStyle={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, padding: 20 }}>
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
              width: 220,
              render: (text: string) => (
                <span style={{ fontWeight: 600 }}>{text}</span>
              ),
            },
            { title: 'Email', dataIndex: 'email', width: 220 },
            { title: 'Số điện thoại', dataIndex: 'phone', width: 150, render: (phone: string | null) => phone || '-' },
            {
              title: 'Tài khoản user',
              dataIndex: 'user',
              width: 200,
              render: (user: Buyer['user']) =>
                user ? (
                  <div>
                    <div style={{ fontWeight: 500 }}>{user.displayName}</div>
                    <Tag>{user.id.slice(0, 8)}</Tag>
                  </div>
                ) : (
                  '-'
                ),
            },
            { title: 'Ngày tạo', dataIndex: 'createdAt', width: 180, render: (createdAt: string) => formatDateTime(createdAt) },
            { title: 'Trạng thái', dataIndex: 'status', width: 130, render: (status: string) => <StatusTag status={status} /> },
            {
              title: 'Thao tác',
              key: 'actions',
              fixed: 'right',
              width: 170,
              render: (_, record) => (
                <Space size={4}>
                  <Button type="text" icon={<EyeOutlined style={{ color: '#2563eb' }} />} onClick={() => detailDrawer.showModal(record)}>
                    Chi tiết
                  </Button>
                  <Button type="text" icon={<EditOutlined style={{ color: '#0284c7' }} />} onClick={() => openEditModal(record)}>
                    Sửa
                  </Button>
                </Space>
              ),
            },
          ]}
        />
      </Card>

      <Modal
        open={buyerModal.open}
        title={isEditing ? 'Cập nhật khách hàng' : 'Thêm khách hàng'}
        okText={isEditing ? 'Cập nhật' : 'Tạo mới'}
        cancelText="Hủy"
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        onOk={() => buyerForm.submit()}
        onCancel={buyerModal.hideModal}
        destroyOnHidden
      >
        <Form<BuyerFormValues> form={buyerForm} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Nhập email.' }, { type: 'email', message: 'Email không hợp lệ.' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="displayName" label="Tên hiển thị" rules={[{ required: true, message: 'Nhập tên hiển thị.' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Số điện thoại">
            <Input />
          </Form.Item>
          <Form.Item name="userId" label="External User ID">
            <Input allowClear />
          </Form.Item>
          <Form.Item name="status" label="Trạng thái">
            <Select options={statusOptions} />
          </Form.Item>
          <Form.Item name="metadataJsonText" label="Metadata nội bộ">
            <Input.TextArea rows={4} placeholder='{"address":"123 Main St"}' />
          </Form.Item>
        </Form>
      </Modal>

      <Drawer
        title="Chi tiết khách hàng"
        open={detailDrawer.open}
        onClose={detailDrawer.hideModal}
        width={520}
      >
        {buyerDetailQuery.isError && <Alert type="error" showIcon message="Không tải được chi tiết" description={extractErrorMessage(buyerDetailQuery.error)} />}
        {activeBuyer && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Tên">{activeBuyer.displayName}</Descriptions.Item>
            <Descriptions.Item label="Email">{activeBuyer.email}</Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">{activeBuyer.phone || '-'}</Descriptions.Item>
            <Descriptions.Item label="Tài khoản user">
              {activeBuyer.user ? (
                <div>
                  <div style={{ fontWeight: 500 }}>{activeBuyer.user.displayName}</div>
                  <Tag>{activeBuyer.user.id.slice(0, 8)}</Tag>
                </div>
              ) : (
                '-'
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái"><StatusTag status={activeBuyer.status} /></Descriptions.Item>
            <Descriptions.Item label="Metadata">
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{stringifyJsonObject(activeBuyer.metadataJson)}</pre>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">{formatDateTime(activeBuyer.createdAt)}</Descriptions.Item>
            <Descriptions.Item label="Cập nhật">{formatDateTime(activeBuyer.updatedAt)}</Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </div>
  );
}
