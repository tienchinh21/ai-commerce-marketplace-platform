import { Card, Table, Tag, Input, Space, Rate, Badge } from 'antd';
import { SearchOutlined, CommentOutlined } from '@ant-design/icons';
import { DataPageHeader } from '../../shared/components/DataPageHeader';
import { StatusTag } from '../../shared/components/StatusTag';

const mockReviews = [
  { id: 'rev-1', product: 'Tai nghe Bluetooth Anker Soundcore Life Q30', user: 'Nguyễn Văn An', rating: 5, content: 'Chống ồn ANC cực đỉnh trong tầm giá, pin dùng cả tuần không hết.', created: '2026-07-28', status: 'ACTIVE' },
  { id: 'rev-2', product: 'Áo thun Nam gia nhiệt Coolmate Active Ultra', user: 'Trần Thị Bình', rating: 5, content: 'Vải mềm mát, thấm hút mồ hôi tốt khi tập gym.', created: '2026-07-27', status: 'ACTIVE' },
  { id: 'rev-3', product: 'Tẩy tế bào chết Cà phê Đắc Lắk Cocoon 200ml', user: 'Lê Hoàng Cường', rating: 4, content: 'Mùi cà phê thơm dễ chịu, tẩy xong da mịn màng.', created: '2026-07-26', status: 'ACTIVE' },
];

export function ReviewsPage() {
  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <DataPageHeader
        title="Quản Lý Đánh Giá & Phản Hồi (Reviews)"
        description="Quản lý dữ liệu đánh giá nguyên bản từ khách hàng và các trạng thái kiểm duyệt (Moderation)."
      />

      <Card style={{ borderRadius: 12, border: '1px solid #e2e8f0' }}>
        <div style={{ marginBottom: 20 }}>
          <Input
            prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
            placeholder="Tìm theo sản phẩm, nội dung review..."
            style={{ width: 340, borderRadius: 8 }}
          />
        </div>

        <Table
          dataSource={mockReviews}
          rowKey="id"
          columns={[
            {
              title: 'Sản phẩm',
              dataIndex: 'product',
              render: (prod) => (
                <Space>
                  <CommentOutlined style={{ color: '#6366f1' }} />
                  <span style={{ fontWeight: 600 }}>{prod}</span>
                </Space>
              ),
            },
            { title: 'Người viết', dataIndex: 'user' },
            {
              title: 'Điểm đánh giá',
              dataIndex: 'rating',
              render: (rating) => <Rate disabled defaultValue={rating} style={{ fontSize: 13 }} />,
            },
            { title: 'Nội dung phản hồi', dataIndex: 'content', width: 360 },
            { title: 'Ngày tạo', dataIndex: 'created' },
            { title: 'Trạng thái', dataIndex: 'status', render: (status) => <StatusTag status={status} /> },
          ]}
        />
      </Card>
    </Space>
  );
}
