import { Card, Table, Tag, Input, Space, Button, Rate, Badge } from 'antd';
import { SearchOutlined, PlusOutlined, ShoppingOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { DataPageHeader } from '../../shared/components/DataPageHeader';
import { StatusTag } from '../../shared/components/StatusTag';

const mockProducts = [
  { id: 'prod-1', title: 'Tai nghe Bluetooth Anker Soundcore Life Q30', category: 'Electronics', brand: 'Anker', price: '1,790,000 ₫', rating: 4.8, reviews: 340, status: 'ACTIVE' },
  { id: 'prod-2', title: 'Áo thun Nam gia nhiệt Coolmate Active Ultra', category: 'Fashion', brand: 'Coolmate', price: '299,000 ₫', rating: 4.9, reviews: 820, status: 'ACTIVE' },
  { id: 'prod-3', title: 'Tẩy tế bào chết Cà phê Đắk Lắk Cocoon 200ml', category: 'Beauty', brand: 'Cocoon', price: '145,000 ₫', rating: 4.9, reviews: 1420, status: 'ACTIVE' },
  { id: 'prod-4', title: 'Giày Chạy Bộ Nam Run Active Decathlon', category: 'Sports-Outdoor', brand: 'Decathlon', price: '899,000 ₫', rating: 4.7, reviews: 190, status: 'ACTIVE' },
];

export function ProductsPage() {
  const navigate = useNavigate();

  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <DataPageHeader
        title="Quản Lý Sản Phẩm (Catalog Products)"
        description="Quản lý thông tin sản phẩm chuẩn hóa (Canonical Products), biến thể, hình ảnh và thuộc tính kỹ thuật specs_json."
      />

      <Card style={{ borderRadius: 12, border: '1px solid #e2e8f0' }}>
        <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Input
            prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
            placeholder="Tìm theo tên sản phẩm, thương hiệu..."
            style={{ width: 340, borderRadius: 8 }}
          />
          <Button type="primary" icon={<PlusOutlined />} style={{ background: '#4f46e5' }}>
            Tạo Sản Phẩm Mới
          </Button>
        </div>

        <Table
          dataSource={mockProducts}
          rowKey="id"
          columns={[
            {
              title: 'Sản phẩm',
              dataIndex: 'title',
              render: (title, record) => (
                <Space>
                  <div style={{ width: 38, height: 38, borderRadius: 8, background: '#f1f5f9', display: 'grid', placeItems: 'center', color: '#6366f1' }}>
                    <ShoppingOutlined />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{title}</div>
                    <Tag color="cyan" style={{ fontSize: 11 }}>Hãng: {record.brand}</Tag>
                  </div>
                </Space>
              ),
            },
            { title: 'Danh mục', dataIndex: 'category', render: (cat) => <Tag color="blue">{cat}</Tag> },
            { title: 'Giá hiển thị', dataIndex: 'price', render: (price) => <span style={{ fontWeight: 700, color: '#16a34a' }}>{price}</span> },
            {
              title: 'Đánh giá & Phản hồi',
              dataIndex: 'rating',
              render: (rating, record) => (
                <Space>
                  <Rate disabled defaultValue={rating} style={{ fontSize: 13 }} />
                  <span style={{ fontWeight: 600 }}>{rating}</span>
                  <Badge count={`${record.reviews} review`} style={{ backgroundColor: '#e2e8f0', color: '#475569' }} />
                </Space>
              ),
            },
            { title: 'Trạng thái', dataIndex: 'status', render: (status) => <StatusTag status={status} /> },
            {
              title: 'Thao tác',
              key: 'action',
              render: (_, record) => (
                <Button
                  type="text"
                  icon={<EyeOutlined style={{ color: '#6366f1' }} />}
                  onClick={() => navigate(`/products/${record.id}`)}
                >
                  Chi tiết
                </Button>
              ),
            },
          ]}
        />
      </Card>
    </Space>
  );
}
