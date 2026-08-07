import { useState } from 'react';
import { Card, Input, Button, Space, Tag, Rate, Typography, Row, Col, Select, Badge } from 'antd';
import { SearchOutlined, RobotOutlined, ThunderboltOutlined, FilterOutlined } from '@ant-design/icons';
import { DataPageHeader } from '@/shared/components/DataPageHeader';

const mockSearchResults = [
  {
    id: 'prod-4',
    title: 'Giày Chạy Bộ Nam Run Active Decathlon Pro',
    category: 'Sports-Outdoor',
    price: '899,000 ₫',
    rating: 4.8,
    similarity: 0.94,
    matchedFields: ['title', 'specs_json.activity_type', 'description'],
    explanation: 'Sản phẩm đáp ứng tiêu chí "giày chạy bộ nhẹ cho người mới bắt đầu", có đệm êm giảm chấn và mức giá dưới 1 triệu VNĐ.',
  },
  {
    id: 'prod-1',
    title: 'Tai nghe Bluetooth Anker Soundcore Life Q30',
    category: 'Electronics',
    price: '1,790,000 ₫',
    rating: 4.8,
    similarity: 0.81,
    matchedFields: ['specs_json.weight', 'description'],
    explanation: 'Phù hợp tiêu chí thiết bị nhẹ gọn, chống ồn tốt nhưng là thiết bị âm thanh thay vì thời trang thể thao.',
  },
];

export function AiSearchPage() {
  const [queryText, setQueryText] = useState('giày chạy bộ nhẹ cho người mới dưới 1 triệu');
  const [searched, setSearched] = useState(true);

  function handleSearch() {
    setSearched(true);
  }

  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <DataPageHeader
        title="Tìm Kiếm Semantic AI (Semantic Product Search)"
        description="Tìm kiếm sản phẩm bằng ngôn ngữ tự nhiên kết hợp bộ lọc có cấu trúc, tìm kiếm Vector trên PostgreSQL + pgvector."
        actions={null}
      />

      {/* AI Query Input Bar */}
      <Card style={{ borderRadius: 16, border: '1px solid #e2e8f0', background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)' }}>
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <Input
              size="large"
              prefix={<RobotOutlined style={{ color: '#6366f1', fontSize: 20 }} />}
              placeholder="Nhập câu hỏi tự nhiên (Ví dụ: Tìm tai nghe chống ồn dưới 2 triệu pin trâu...)"
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              onPressEnter={handleSearch}
              style={{ borderRadius: 10, fontSize: 15 }}
            />
            <Button
              type="primary"
              size="large"
              icon={<SearchOutlined />}
              onClick={handleSearch}
              style={{ borderRadius: 10, padding: '0 28px', background: '#4f46e5', fontWeight: 600, height: 46 }}
            >
              Tìm Kiếm AI
            </Button>
          </div>

          <Row gutter={16} align="middle">
            <Col>
              <Space style={{ color: '#64748b', fontSize: 13 }}>
                <FilterOutlined /> Bộ lọc cấu trúc:
              </Space>
            </Col>
            <Col>
              <Select defaultValue="all" style={{ width: 160 }} options={[
                { value: 'all', label: 'Tất cả danh mục' },
                { value: 'electronics', label: 'Electronics' },
                { value: 'sports-outdoor', label: 'Sports-Outdoor' },
              ]} />
            </Col>
            <Col>
              <Select defaultValue="price_asc" style={{ width: 160 }} options={[
                { value: 'relevance', label: 'Độ khớp Vector' },
                { value: 'price_asc', label: 'Giá tăng dần' },
              ]} />
            </Col>
          </Row>
        </Space>
      </Card>

      {/* Results Section */}
      {searched && (
        <Card title={<span style={{ fontWeight: 700 }}>Kết quả tìm kiếm AI cho: "{queryText}"</span>} style={{ borderRadius: 12 }}>
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            {mockSearchResults.map((item) => (
              <Card key={item.id} type="inner" style={{ borderRadius: 10, border: '1px solid #cbd5e1' }}>
                <Row justify="space-between" align="middle" style={{ marginBottom: 8 }}>
                  <Col>
                    <Space size={12}>
                      <Typography.Title level={4} style={{ margin: 0, color: '#0f172a' }}>
                        {item.title}
                      </Typography.Title>
                      <Tag color="blue">{item.category}</Tag>
                    </Space>
                  </Col>
                  <Col>
                    <Badge
                      count={`Độ tương đồng Vector: ${(item.similarity * 100).toFixed(0)}%`}
                      style={{ backgroundColor: '#10b981', padding: '4px 10px', fontSize: 12, fontWeight: 700 }}
                    />
                  </Col>
                </Row>

                <Row gutter={16} style={{ marginBottom: 12 }}>
                  <Col span={6}>Giá: <strong style={{ color: '#16a34a', fontSize: 15 }}>{item.price}</strong></Col>
                  <Col span={6}>Đánh giá: <Rate disabled defaultValue={item.rating} style={{ fontSize: 12 }} /></Col>
                  <Col span={12}>Matched Fields: {item.matchedFields.map(f => <Tag key={f} color="purple">{f}</Tag>)}</Col>
                </Row>

                <div style={{ background: '#f0fdf4', padding: '10px 14px', borderRadius: 8, borderLeft: '4px solid #22c55e' }}>
                  <Space>
                    <ThunderboltOutlined style={{ color: '#16a34a' }} />
                    <Typography.Text style={{ color: '#15803d', fontSize: 13 }}>
                      <strong>Giải thích từ AI:</strong> {item.explanation}
                    </Typography.Text>
                  </Space>
                </div>
              </Card>
            ))}
          </Space>
        </Card>
      )}
    </Space>
  );
}
