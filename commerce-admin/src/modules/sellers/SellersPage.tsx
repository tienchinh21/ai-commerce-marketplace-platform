import { Card, Table, Tag, Input, Space, Button, Rate, Avatar } from 'antd';
import { SearchOutlined, ShopOutlined, PlusOutlined } from '@ant-design/icons';
import { DataPageHeader } from '../../shared/components/DataPageHeader';
import { StatusTag } from '../../shared/components/StatusTag';

const mockSellers = [
  { id: 'sel-1', name: 'Anker Official Store', slug: 'anker-official', rating: 4.9, products: 42, status: 'ACTIVE' },
  { id: 'sel-2', name: 'Coolmate Vietnam', slug: 'coolmate-vn', rating: 4.8, products: 120, status: 'ACTIVE' },
  { id: 'sel-3', name: 'Cocoon Vietnam', slug: 'cocoon-beauty', rating: 4.9, products: 35, status: 'ACTIVE' },
  { id: 'sel-4', name: 'Decathlon Sport', slug: 'decathlon-sport', rating: 4.7, products: 210, status: 'ACTIVE' },
];

export function SellersPage() {
  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <DataPageHeader
        title="Quản Lý Nhà Bán Hàng (Sellers)"
        description="Danh sách đối tác bán hàng, gian hàng và chỉ số đánh giá uy tín."
      />

      <Card style={{ borderRadius: 12, border: '1px solid #e2e8f0' }}>
        <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Input
            prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
            placeholder="Tìm theo tên nhà bán hàng..."
            style={{ width: 340, borderRadius: 8 }}
          />
          <Button type="primary" icon={<PlusOutlined />} style={{ background: '#4f46e5' }}>
            Thêm Nhà Bán Hàng
          </Button>
        </div>

        <Table
          dataSource={mockSellers}
          rowKey="id"
          columns={[
            {
              title: 'Nhà bán hàng',
              dataIndex: 'name',
              render: (text) => (
                <Space>
                  <Avatar icon={<ShopOutlined />} style={{ backgroundColor: '#e0e7ff', color: '#4f46e5' }} />
                  <span style={{ fontWeight: 600 }}>{text}</span>
                </Space>
              ),
            },
            { title: 'Slug gian hàng', dataIndex: 'slug', render: (slug) => <Tag color="blue">{slug}</Tag> },
            {
              title: 'Đánh giá trung bình',
              dataIndex: 'rating',
              render: (rating) => (
                <Space>
                  <Rate disabled defaultValue={rating} style={{ fontSize: 14 }} />
                  <span style={{ fontWeight: 600 }}>{rating}</span>
                </Space>
              ),
            },
            { title: 'Số sản phẩm', dataIndex: 'products', render: (num) => <strong>{num} SKU</strong> },
            { title: 'Trạng thái', dataIndex: 'status', render: (status) => <StatusTag status={status} /> },
          ]}
        />
      </Card>
    </Space>
  );
}
