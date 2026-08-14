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
import { createSeller, fetchSellerDetail, fetchSellers, updateSeller } from './seller.api';
import type { Seller, SellerPayload } from './seller.types';

const DEFAULT_PAGE_SIZE = 20;
const statusOptions = [
  { value: 'ACTIVE', label: 'ACTIVE' },
  { value: 'INACTIVE', label: 'INACTIVE' },
];

interface SellerFormValues extends Omit<SellerPayload, 'metadataJson'> {
  metadataJsonText?: string;
}

export function SellersPage() {
  const notify = useNotification();
  const queryClient = useQueryClient();
  const [sellerForm] = Form.useForm<SellerFormValues>();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const debouncedKeyword = useDebounce(searchKeyword, 300);
  const sellerModal = useModalState<Seller>();
  const detailDrawer = useModalState<Seller>();

  const sellersQuery = useQuery({
    queryKey: ['cms-sellers', debouncedKeyword, page, pageSize],
    queryFn: () =>
      fetchSellers({
        search: debouncedKeyword.trim() || undefined,
        page,
        pageSize,
      }),
  });

  const sellerDetailQuery = useQuery({
    queryKey: ['cms-seller-detail', detailDrawer.data?.id],
    queryFn: () => fetchSellerDetail(detailDrawer.data?.id as string),
    enabled: detailDrawer.open && Boolean(detailDrawer.data?.id),
  });

  const createMutation = useMutation({
    mutationFn: createSeller,
    onSuccess: async () => {
      notify.success('Đã tạo nhà bán hàng.');
      sellerForm.resetFields();
      sellerModal.hideModal();
      await queryClient.invalidateQueries({ queryKey: ['cms-sellers'] });
    },
    onError: (error) => notify.error(error, 'Tạo nhà bán hàng thất bại.'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: SellerPayload }) => updateSeller(id, payload),
    onSuccess: async () => {
      notify.success('Đã cập nhật nhà bán hàng.');
      sellerForm.resetFields();
      sellerModal.hideModal();
      await queryClient.invalidateQueries({ queryKey: ['cms-sellers'] });
    },
    onError: (error) => notify.error(error, 'Cập nhật nhà bán hàng thất bại.'),
  });

  function openCreateModal() {
    sellerForm.resetFields();
    sellerForm.setFieldsValue({ status: 'ACTIVE', metadataJsonText: '{}' });
    sellerModal.showModal();
  }

  function openEditModal(seller: Seller) {
    sellerForm.setFieldsValue({
      name: seller.name,
      slug: seller.slug,
      status: seller.status,
      userId: seller.userId,
      metadataJsonText: stringifyJsonObject(seller.metadataJson),
    });
    sellerModal.showModal(seller);
  }

  function handleSubmit(values: SellerFormValues) {
    let metadataJson: Record<string, unknown>;
    try {
      metadataJson = parseJsonObject(values.metadataJsonText);
    } catch (error) {
      notify.error(error, 'Metadata JSON không hợp lệ.');
      return;
    }

    const payload: SellerPayload = {
      name: values.name,
      slug: values.slug || undefined,
      status: values.status ?? 'ACTIVE',
      userId: values.userId || null,
      metadataJson,
    };

    if (sellerModal.data) {
      updateMutation.mutate({ id: sellerModal.data.id, payload });
      return;
    }
    createMutation.mutate(payload);
  }

  const activeSeller = sellerDetailQuery.data ?? detailDrawer.data;
  const isEditing = Boolean(sellerModal.data);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, gap: 20 }}>
      <DataPageHeader
        title="Quản Lý Nhà Bán Hàng (Sellers)"
        description="Danh sách đối tác bán hàng, trạng thái gian hàng và metadata vận hành nội bộ."
        onRefresh={() => sellersQuery.refetch()}
        actions={
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal} style={{ background: '#4f46e5' }}>
            Thêm Nhà Bán Hàng
          </Button>
        }
      />

      {sellersQuery.isError && (
        <Alert type="error" showIcon message="Không tải được danh sách nhà bán hàng" description={extractErrorMessage(sellersQuery.error)} />
      )}

      <Card style={{ borderRadius: 12, flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }} bodyStyle={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, padding: 20 }}>
        <div style={{ marginBottom: 20 }}>
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
              width: 220,
              render: (text: string) => (
                <span style={{ fontWeight: 600 }}>{text}</span>
              ),
            },
            { title: 'Slug gian hàng', dataIndex: 'slug', width: 180, render: (slug: string) => <Tag color="blue">{slug}</Tag> },
            {
              title: 'Tài khoản user',
              dataIndex: 'user',
              width: 200,
              render: (user: Seller['user']) =>
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
        open={sellerModal.open}
        title={isEditing ? 'Cập nhật nhà bán hàng' : 'Thêm nhà bán hàng'}
        okText={isEditing ? 'Cập nhật' : 'Tạo mới'}
        cancelText="Hủy"
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        onOk={() => sellerForm.submit()}
        onCancel={sellerModal.hideModal}
        destroyOnHidden
      >
        <Form<SellerFormValues> form={sellerForm} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label="Tên nhà bán hàng" rules={[{ required: true, message: 'Nhập tên nhà bán hàng.' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="slug" label="Slug gian hàng">
            <Input />
          </Form.Item>
          <Form.Item name="userId" label="External User ID">
            <Input allowClear />
          </Form.Item>
          <Form.Item name="status" label="Trạng thái">
            <Select options={statusOptions} />
          </Form.Item>
          <Form.Item name="metadataJsonText" label="Metadata nội bộ">
            <Input.TextArea rows={4} placeholder='{"taxId":"123456789"}' />
          </Form.Item>
        </Form>
      </Modal>

      <Drawer
        title="Chi tiết nhà bán hàng"
        open={detailDrawer.open}
        onClose={detailDrawer.hideModal}
        width={520}
      >
        {sellerDetailQuery.isError && <Alert type="error" showIcon message="Không tải được chi tiết" description={extractErrorMessage(sellerDetailQuery.error)} />}
        {activeSeller && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Tên">{activeSeller.name}</Descriptions.Item>
            <Descriptions.Item label="Slug">{activeSeller.slug}</Descriptions.Item>
            <Descriptions.Item label="Tài khoản user">
              {activeSeller.user ? (
                <div>
                  <div style={{ fontWeight: 500 }}>{activeSeller.user.displayName}</div>
                  <Tag>{activeSeller.user.id.slice(0, 8)}</Tag>
                </div>
              ) : (
                '-'
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái"><StatusTag status={activeSeller.status} /></Descriptions.Item>
            <Descriptions.Item label="Metadata">
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{stringifyJsonObject(activeSeller.metadataJson)}</pre>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">{formatDateTime(activeSeller.createdAt)}</Descriptions.Item>
            <Descriptions.Item label="Cập nhật">{formatDateTime(activeSeller.updatedAt)}</Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </div>
  );
}
