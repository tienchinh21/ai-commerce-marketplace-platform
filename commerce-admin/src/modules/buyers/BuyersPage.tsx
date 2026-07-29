import { Card, Table, Tag, Input, Space, Avatar } from 'antd';
import { SearchOutlined, UserOutlined } from '@ant-design/icons';
import { DataPageHeader } from '../../shared/components/DataPageHeader';
import { StatusTag } from '../../shared/components/StatusTag';

const mockBuyers = [
  { id: 'buy-1', name: 'Nguyễn Văn An', email: 'an.nguyen@gmail.com', phone: '0901234567', orders: 12, status: 'ACTIVE' },
  { id: 'buy-2', name: 'Trần Thị Bình', email: 'binh.tran@yahoo.com', phone: '0912345678', orders: 5, status: 'ACTIVE' },
  { id: 'buy-3', name: 'Lê Hoàng Cường', email: 'cuong.le@outlook.com', phone: '0987654321', orders: 28, status: 'ACTIVE' },
];

export function BuyersPage() {
  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <DataPageHeader
        title="Quản Lý Khách Hàng (Buyers)"
        description="Danh sách người mua hàng, tài khoản và lịch sử đơn hàng."
      />

      <Card style={{ borderRadius: 12, border: '1px solid #e2e8f0' }}>
        <div style={{ marginBottom: 20 }}>
          <Input
            prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
            placeholder="Tìm theo tên, email hoặc số điện thoại..."
            style={{ width: 340, borderRadius: 8 }}
          />
        </div>

        <Table
          dataSource={mockBuyers}
          rowKey="id"
          columns={[
            {
              title: 'Tên khách hàng',
              dataIndex: 'name',
              render: (text) => (
                <Space>
                  <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }} />
                  <span style={{ fontWeight: 600 }}>{text}</span>
                </Space>
              ),
            },
            { title: 'Email', dataIndex: 'email' },
            { title: 'Số điện thoại', dataIndex: 'phone' },
            { title: 'Số đơn hàng', dataIndex: 'orders', render: (num) => <Tag color="purple">{num} đơn</Tag> },
            { title: 'Trạng thái', dataIndex: 'status', render: (status) => <StatusTag status={status} /> },
          ]}
        />
      </Card>
    </Space>
  );
}
