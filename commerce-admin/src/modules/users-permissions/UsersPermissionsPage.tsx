import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Alert, Avatar, Button, Card, Input, Space, Tag } from 'antd';
import { PlusOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import { DataPageHeader } from '@/shared/components/DataPageHeader';
import { StatusTag } from '@/shared/components/StatusTag';
import { CoreTable } from '@/shared/components/CoreTable';
import { useDebounce } from '@/shared/hooks';
import { extractErrorMessage } from '@/shared/utils/error-handler';
import { formatDateTime } from '@/shared/utils/formatters';
import { fetchPermissions, fetchUsersWithPermissions } from './users-permissions.api';
import type { AdminUserWithPermissions, Permission } from './users-permissions.types';

export function UsersPermissionsPage() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const debouncedKeyword = useDebounce(searchKeyword, 300);

  const usersQuery = useQuery({
    queryKey: ['cms-users-with-permissions'],
    queryFn: fetchUsersWithPermissions,
  });
  const permissionsQuery = useQuery({
    queryKey: ['cms-permissions'],
    queryFn: fetchPermissions,
  });

  const users = useMemo(() => {
    const items = usersQuery.data ?? [];
    const query = debouncedKeyword.trim().toLowerCase();
    if (!query) return items;
    return items.filter((user) =>
      [user.displayName, user.email, user.status, ...user.permissions]
        .some((value) => value.toLowerCase().includes(query))
    );
  }, [usersQuery.data, debouncedKeyword]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, gap: 20 }}>
      <DataPageHeader
        title="Quản Lý Người Dùng & Phân Quyền (Users & Permissions)"
        description="Quản lý tài khoản Admin internal và phân quyền truy cập theo cơ chế RBAC (Resource:Action Permissions)."
        onRefresh={() => {
          usersQuery.refetch();
          permissionsQuery.refetch();
        }}
      />

      {(usersQuery.isError || permissionsQuery.isError) && (
        <Alert
          type="error"
          showIcon
          message="Không tải được dữ liệu người dùng hoặc quyền"
          description={extractErrorMessage(usersQuery.error ?? permissionsQuery.error)}
        />
      )}

      <Card style={{ borderRadius: 12, border: '1px solid #e2e8f0', flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }} bodyStyle={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, padding: 20 }}>
        <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Input
            prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
            placeholder="Tìm theo tên người dùng, email, mã quyền..."
            value={searchKeyword}
            onChange={(event) => setSearchKeyword(event.target.value)}
            style={{ width: 340, borderRadius: 8 }}
            allowClear
          />
          <Button type="primary" icon={<PlusOutlined />} style={{ background: '#4f46e5' }}>
            Tạo Tài Khoản Mới
          </Button>
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
                <Space>
                  <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#4f46e5' }} />
                  <span style={{ fontWeight: 600 }}>{displayName}</span>
                </Space>
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
          ]}
        />
      </Card>

      <Card title="Danh mục quyền hệ thống" style={{ borderRadius: 12, border: '1px solid #e2e8f0' }}>
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
    </div>
  );
}
