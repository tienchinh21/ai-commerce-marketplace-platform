import { useState } from 'react';
import { Alert, Button, Card, Col, Empty, Input, Row, Select, Space } from 'antd';
import { FilterOutlined, RobotOutlined, SearchOutlined } from '@ant-design/icons';
import { DataPageHeader } from '@/shared/components/DataPageHeader';

export function AiSearchPage() {
  const [queryText, setQueryText] = useState('');

  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <DataPageHeader
        title="Tìm Kiếm Semantic AI (Semantic Product Search)"
        description="Tìm kiếm sản phẩm bằng ngôn ngữ tự nhiên kết hợp bộ lọc có cấu trúc, tìm kiếm Vector trên PostgreSQL + pgvector."
        actions={null}
      />

      <Alert
        type="warning"
        showIcon
        message="Chưa có API AI Search để kết nối"
        description="Page này đã bỏ dữ liệu giả. Khi commerce-ai-platform cung cấp endpoint, thêm API wrapper thật rồi render kết quả từ response."
      />

      <Card style={{ borderRadius: 16 }}>
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <Input
              size="large"
              prefix={<RobotOutlined style={{ color: '#6366f1', fontSize: 20 }} />}
              placeholder="Nhập câu hỏi tự nhiên..."
              value={queryText}
              onChange={(event) => setQueryText(event.target.value)}
              style={{ borderRadius: 10, fontSize: 15 }}
            />
            <Button
              type="primary"
              size="large"
              icon={<SearchOutlined />}
              disabled
              style={{ borderRadius: 10, padding: '0 28px', fontWeight: 600, height: 46 }}
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
              <Select disabled value="all" style={{ width: 160 }} options={[{ value: 'all', label: 'Tất cả danh mục' }]} />
            </Col>
            <Col>
              <Select disabled value="relevance" style={{ width: 160 }} options={[{ value: 'relevance', label: 'Độ khớp Vector' }]} />
            </Col>
          </Row>
        </Space>
      </Card>

      <Card title="Kết quả tìm kiếm AI" style={{ borderRadius: 12 }}>
        <Empty description="Chưa có dữ liệu vì chưa kết nối API AI Search." />
      </Card>
    </Space>
  );
}
