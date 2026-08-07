import { useState } from 'react';
import { Card, Input, Button, Space, Table, Tag, Typography, Alert, Row, Col } from 'antd';
import { RobotOutlined, SendOutlined, SafetyCertificateOutlined, CodeOutlined, AreaChartOutlined } from '@ant-design/icons';
import { DataPageHeader } from '@/shared/components/DataPageHeader';

export function AnalystChatPage() {
  const [prompt, setPrompt] = useState('Top 5 sản phẩm có nhiều đánh giá tiêu cực nhất tháng này là gì?');
  const [submitted, setSubmitted] = useState(true);

  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <DataPageHeader
        title="Trợ Lý Báo Cáo AI (Text-to-SQL Analyst)"
        description="Hỏi đáp dữ liệu báo cáo bằng tiếng Việt tự nhiên. AI sinh truy vấn SQL an toàn (Chỉ SELECT) và trả về bảng + biểu đồ trực quan."
        actions={null}
      />

      <Card style={{ borderRadius: 16, border: '1px solid #e2e8f0' }}>
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Alert
            message="Chế độ SQL Guardrail Bảo Mật: Chỉ cho phép câu lệnh SELECT read-only trên database views analytics."
            type="info"
            showIcon
            icon={<SafetyCertificateOutlined style={{ color: '#4f46e5' }} />}
            style={{ borderRadius: 8 }}
          />

          <div style={{ display: 'flex', gap: 12 }}>
            <Input.TextArea
              rows={2}
              placeholder="Nhập câu hỏi báo cáo dữ liệu của bạn bằng tiếng Việt..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              style={{ borderRadius: 10, fontSize: 14 }}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={() => setSubmitted(true)}
              style={{ height: 'auto', padding: '0 24px', borderRadius: 10, background: '#4f46e5', fontWeight: 600 }}
            >
              Gửi câu hỏi
            </Button>
          </div>
        </Space>
      </Card>

      {submitted && (
        <Space direction="vertical" size={20} style={{ width: '100%' }}>
          {/* Answer Summary Card */}
          <Card title={<span style={{ fontWeight: 700 }}><RobotOutlined style={{ color: '#6366f1' }} /> Phản hồi từ AI Analyst</span>} style={{ borderRadius: 12 }}>
            <Typography.Paragraph style={{ fontSize: 14 }}>
              Dựa trên phân tích 4,560 đánh giá trong cơ sở dữ liệu Marketplace, dưới đây là danh sách 2 sản phẩm ghi nhận phản hồi cần lưu ý trong tháng này:
            </Typography.Paragraph>

            {/* Generated SQL Preview */}
            <Card type="inner" title={<span style={{ fontSize: 13, color: '#475569' }}><CodeOutlined /> Câu lệnh SQL được sinh tự động & đã qua kiểm duyệt</span>} style={{ background: '#0f172a', borderRadius: 8, marginBottom: 16 }}>
              <pre style={{ margin: 0, color: '#38bdf8', fontSize: 13, fontFamily: 'monospace' }}>
{`SELECT p.id, p.title, p.brand, COUNT(r.id) AS negative_reviews_count
FROM marketplace.products p
JOIN marketplace.reviews r ON p.id = r.product_id
JOIN ai.review_ai_analysis a ON r.id = a.review_id
WHERE a.sentiment = 'NEGATIVE'
GROUP BY p.id, p.title, p.brand
ORDER BY negative_reviews_count DESC
LIMIT 5;`}
              </pre>
            </Card>

            {/* Result Table */}
            <Table
              pagination={false}
              dataSource={[
                { id: 'prod-10', title: 'Củ sạc nhanh 20W Generic Fake', brand: 'Generic', count: 18, category: 'Electronics' },
                { id: 'prod-12', title: 'Áo khoác dù chống nước nhẹ Uniqlo Replica', brand: 'OEM', count: 9, category: 'Fashion' },
              ]}
              columns={[
                { title: 'ID Sản phẩm', dataIndex: 'id', render: (id) => <Tag color="blue">{id}</Tag> },
                { title: 'Tên sản phẩm', dataIndex: 'title', render: (t) => <strong>{t}</strong> },
                { title: 'Thương hiệu', dataIndex: 'brand' },
                { title: 'Danh mục', dataIndex: 'category' },
                { title: 'Số review tiêu cực', dataIndex: 'count', render: (c) => <Tag color="red" style={{ fontWeight: 700 }}>{c} phàn nàn</Tag> },
              ]}
            />
          </Card>
        </Space>
      )}
    </Space>
  );
}
