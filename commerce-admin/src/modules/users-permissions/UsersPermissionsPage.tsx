import { Card, Table, Tag, Input, Space, Button, Avatar } from 'antd';
import { SearchOutlined, SafetyCertificateOutlined, UserOutlined, PlusOutlined } from '@ant-design/icons';
import { DataPageHeader } from '@/shared/components/DataPageHeader';
import { StatusTag } from '@/shared/components/StatusTag';

const mockUsers = [
  { id: 'usr-1', name: 'Quản trị viên Hệ thống', email: 'admin@example.com', role: 'Super Admin', permissions: ['ALL_PERMISSIONS'], status: 'ACTIVE' },
  { id: 'usr-2', name: 'Văn Thị Mai', email: 'mai.van@okz.vn', role: 'Catalog Manager', permissions: ['product:read', 'product:write', 'category:read'], status: 'ACTIVE' },
  { id: 'usr-3', name: 'Hoàng Minh Tuấn', email: 'tuan.hoang@okz.vn', role: 'AI Analyst User', permissions: ['ai:search', 'ai:analyst:chat', 'review:read'], status: 'ACTIVE' },
];

export function UsersPermissionsPage() {
  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <DataPageHeader
        title="Quản Lý Người Dùng & Phân Quyền (Users & Permissions)"
        description="Quản lý tài khoản Admin internal và phân quyền truy cập theo cơ chế RBAC (Resource:Action Permissions)."
      />

      <Card style={{ borderRadius: 12, border: '1px solid #e2e8f0' }}>
        <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Input
            prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
            placeholder="Tìm theo tên người dùng, email..."
            style={{ width: 340, borderRadius: 8 }}
          />
          <Button type="primary" icon={<PlusOutlined />} style={{ background: '#4f46e5' }}>
            Tạo Tài Khoản Mới
          </Button>
        </div>

        <Table
          dataSource={mockUsers}
          rowKey="id"
          columns={[
            {
              title: 'Người dùng',
              dataIndex: 'name',
              render: (name) => (
                <Space>
                  <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#4f46e5' }} />
                  <span style={{ fontWeight: 600 }}>{name}</span>
                </Space>
              ),
            },
            { title: 'Email', dataIndex: 'email' },
            { title: 'Vai trò', dataIndex: 'role', render: (role) => <Tag color="purple">{role}</Tag> },
            {
              title: 'Mã quyền RBAC',
              dataIndex: 'permissions',
              render: (perms: string[]) => perms.map(p => <Tag key={p} color="blue">{p}</Tag>),
            },
            { title: 'Trạng thái', dataIndex: 'status', render: (status) => <StatusTag status={status} /> },
          ]}
        />
      </Card>
    </Space>
  );
}
