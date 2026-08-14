import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert, Button, Card, Form, Input, Modal, Select, Space, Tag } from 'antd';
import { EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { DataPageHeader } from '@/shared/components/DataPageHeader';
import { StatusTag } from '@/shared/components/StatusTag';
import { CoreTable } from '@/shared/components/CoreTable';
import { useDebounce, useModalState, useNotification } from '@/shared/hooks';
import { extractErrorMessage } from '@/shared/utils/error-handler';
import { formatDateTime } from '@/shared/utils/formatters';
import { createUser, fetchPermissions, fetchUsersWithPermissions, setUserPermissions } from './users-permissions.api';
import type { AdminUserWithPermissions, CreateUserPayload, Permission } from './users-permissions.types';

const statusOptions = [
  { value: 'ACTIVE', label: 'ACTIVE' },
  { value: 'INACTIVE', label: 'INACTIVE' },
];

interface PermissionsFormValues {
  permissions: string[];
}

export function UsersPermissionsPage() {
  const notify = useNotification();
  const queryClient = useQueryClient();
  const [userForm] = Form.useForm<CreateUserPayload>();
  const [permissionsForm] = Form.useForm<PermissionsFormValues>();
  const [searchKeyword, setSearchKeyword] = useState('');
  const debouncedKeyword = useDebounce(searchKeyword, 300);
  const userModal = useModalState();
  const permissionsModal = useModalState<AdminUserWithPermissions>();

  const usersQuery = useQuery({
    queryKey: ['cms-users-with-permissions'],
    queryFn: fetchUsersWithPermissions,
  });
  const permissionsQuery = useQuery({
    queryKey: ['cms-permissions'],
    queryFn: fetchPermissions,
  });

  const refresh = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['cms-users-with-permissions'] }),
      queryClient.invalidateQueries({ queryKey: ['cms-permissions'] }),
    ]);
  };

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: async () => {
      notify.success('Đã tạo tài khoản admin.');
      userForm.resetFields();
      userModal.hideModal();
      await refresh();
    },
    onError: (error) => notify.error(error, 'Tạo tài khoản thất bại.'),
  });

  const setPermissionsMutation = useMutation({
    mutationFn: ({ userId, codes }: { userId: string; codes: string[] }) => setUserPermissions(userId, codes),
    onSuccess: async () => {
      notify.success('Đã cập nhật quyền người dùng.');
      permissionsForm.resetFields();
      permissionsModal.hideModal();
      await refresh();
    },
    onError: (error) => notify.error(error, 'Cập nhật quyền thất bại.'),
  });

  const users = useMemo(() => {
    const items = usersQuery.data ?? [];
    const query = debouncedKeyword.trim().toLowerCase();
    if (!query) return items;
    return items.filter((user) =>
      [user.displayName, user.email, user.status, ...user.permissions]
        .some((value) => value.toLowerCase().includes(query)),
    );
  }, [usersQuery.data, debouncedKeyword]);

  const permissionOptions = permissionsQuery.data?.map((permission) => ({
    value: permission.code,
    label: permission.code,
  })) ?? [];

  function openCreateUserModal() {
    userForm.resetFields();
    userForm.setFieldsValue({ status: 'ACTIVE', permissionCodes: [] });
    userModal.showModal();
  }

  function openPermissionsModal(user: AdminUserWithPermissions) {
    permissionsForm.setFieldsValue({ permissions: user.permissions });
    permissionsModal.showModal(user);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, gap: 20 }}>
      <DataPageHeader
        title="Quản Lý Người Dùng & Phân Quyền"
        description="Quản lý tài khoản Admin internal và quyền truy cập theo cơ chế RBAC."
        onRefresh={refresh}
        actions={
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateUserModal} style={{ background: '#4f46e5' }}>
            Tạo Tài Khoản
          </Button>
        }
      />

      {(usersQuery.isError || permissionsQuery.isError) && (
        <Alert
          type="error"
          showIcon
          message="Không tải được dữ liệu người dùng hoặc quyền"
          description={extractErrorMessage(usersQuery.error ?? permissionsQuery.error)}
        />
      )}

      <Card style={{ borderRadius: 12, flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }} bodyStyle={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, padding: 20 }}>
        <div style={{ marginBottom: 20 }}>
          <Input
            prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
            placeholder="Tìm theo tên người dùng, email, mã quyền..."
            value={searchKeyword}
            onChange={(event) => setSearchKeyword(event.target.value)}
            style={{ width: 340, borderRadius: 8 }}
            allowClear
          />
        </div>

        <CoreTable<AdminUserWithPermissions>
          dataSource={users}
          rowKey="id"
          loading={usersQuery.isLoading}
          columns={[
            {
              title: 'Người dùng',
              dataIndex: 'displayName',
              render: (displayName: string) => (
                <span style={{ fontWeight: 600 }}>{displayName}</span>
              ),
            },
            { title: 'Email', dataIndex: 'email' },
            {
              title: 'Mã quyền RBAC',
              dataIndex: 'permissions',
              render: (permissions: string[]) => permissions.length > 0 ? permissions.map((permission) => <Tag key={permission} color="blue">{permission}</Tag>) : '-',
            },
            { title: 'Ngày tạo', dataIndex: 'createdAt', render: (createdAt: string) => formatDateTime(createdAt) },
            { title: 'Trạng thái', dataIndex: 'status', render: (status: string) => <StatusTag status={status} /> },
            {
              title: 'Thao tác',
              key: 'actions',
              render: (_, record) => (
                <Button type="text" icon={<EditOutlined />} onClick={() => openPermissionsModal(record)}>
                  Sửa quyền
                </Button>
              ),
            },
          ]}
        />
      </Card>

      <Card title="Danh mục quyền hệ thống" style={{ borderRadius: 12 }}>
        <CoreTable<Permission>
          dataSource={permissionsQuery.data ?? []}
          rowKey="id"
          loading={permissionsQuery.isLoading}
          pagination={{ pageSize: 10 }}
          columns={[
            { title: 'Mã quyền', dataIndex: 'code', render: (code: string) => <Tag color="purple">{code}</Tag> },
            { title: 'Mô tả', dataIndex: 'description', render: (description: string | null) => description || '-' },
            { title: 'Ngày tạo', dataIndex: 'createdAt', render: (createdAt: string) => formatDateTime(createdAt) },
          ]}
        />
      </Card>

      <Modal
        open={userModal.open}
        title="Tạo tài khoản admin"
        okText="Tạo tài khoản"
        cancelText="Hủy"
        confirmLoading={createUserMutation.isPending}
        onOk={() => userForm.submit()}
        onCancel={userModal.hideModal}
        destroyOnHidden
      >
        <Form<CreateUserPayload>
          form={userForm}
          layout="vertical"
          onFinish={(values) => createUserMutation.mutate(values)}
        >
          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Nhập email.' }, { type: 'email', message: 'Email không hợp lệ.' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: 'Nhập mật khẩu.' }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="displayName" label="Tên hiển thị" rules={[{ required: true, message: 'Nhập tên hiển thị.' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="status" label="Trạng thái">
            <Select options={statusOptions} />
          </Form.Item>
          <Form.Item name="permissionCodes" label="Quyền">
            <Select mode="multiple" options={permissionOptions} optionFilterProp="label" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={permissionsModal.open}
        title={`Sửa quyền: ${permissionsModal.data?.displayName ?? ''}`}
        okText="Cập nhật quyền"
        cancelText="Hủy"
        confirmLoading={setPermissionsMutation.isPending}
        onOk={() => permissionsForm.submit()}
        onCancel={permissionsModal.hideModal}
        destroyOnHidden
      >
        <Form<PermissionsFormValues>
          form={permissionsForm}
          layout="vertical"
          onFinish={(values) => {
            if (permissionsModal.data) {
              setPermissionsMutation.mutate({ userId: permissionsModal.data.id, codes: values.permissions ?? [] });
            }
          }}
        >
          <Form.Item name="permissions" label="Quyền">
            <Select mode="multiple" options={permissionOptions} optionFilterProp="label" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
