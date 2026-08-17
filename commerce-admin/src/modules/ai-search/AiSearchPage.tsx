import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  Alert,
  Button,
  Card,
  Col,
  Empty,
  Input,
  Progress,
  Row,
  Select,
  Space,
  Spin,
  Tag,
  Typography,
} from 'antd';
import {
  CheckCircleOutlined,
  FilterOutlined,
  InfoCircleOutlined,
  RobotOutlined,
  SearchOutlined,
  ShopOutlined,
  StarFilled,
} from '@ant-design/icons';
import { DataPageHeader } from '@/shared/components/DataPageHeader';
import { searchAiProducts } from './ai-search.api';
import type { SemanticProductSearchResponse } from './ai-search.types';

const { Paragraph, Text, Title } = Typography;

export function AiSearchPage() {
  const [queryText, setQueryText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const searchMutation = useMutation<
    SemanticProductSearchResponse,
    Error,
    { query: string; category?: string }
  >({
    mutationFn: ({ query, category }) =>
      searchAiProducts({
        query,
        filters: category && category !== 'all' ? { category } : undefined,
        limit: 12,
      }),
  });

  const handleSearch = () => {
    if (!queryText.trim()) return;
    searchMutation.mutate({
      query: queryText.trim(),
      category: categoryFilter,
    });
  };

  const results = searchMutation.data?.items ?? [];

  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <DataPageHeader
        title="Tìm Kiếm Semantic AI (Semantic Product Search)"
        description="Tìm kiếm sản phẩm bằng ngôn ngữ tự nhiên kết hợp bộ lọc có cấu trúc, tìm kiếm Vector trên PostgreSQL + pgvector."
        actions={null}
      />

      {searchMutation.isError && (
        <Alert
          type="error"
          showIcon
          message="Không thể kết nối đến AI Platform"
          description={searchMutation.error?.message || 'Vui lòng kiểm tra dịch vụ commerce-ai-platform đang chạy.'}
        />
      )}

      <Card style={{ borderRadius: 16 }}>
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <Input
              size="large"
              prefix={<RobotOutlined style={{ color: '#6366f1', fontSize: 20 }} />}
              placeholder="Nhập câu hỏi tự nhiên (ví dụ: kem chống nắng cho da dầu, giày chạy bộ nhẹ...)"
              value={queryText}
              onChange={(event) => setQueryText(event.target.value)}
              onPressEnter={handleSearch}
              style={{ borderRadius: 10, fontSize: 15 }}
            />
            <Button
              type="primary"
              size="large"
              icon={<SearchOutlined />}
              loading={searchMutation.isPending}
              disabled={!queryText.trim()}
              onClick={handleSearch}
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
              <Select
                value={categoryFilter}
                onChange={setCategoryFilter}
                style={{ width: 180 }}
                options={[
                  { value: 'all', label: 'Tất cả danh mục' },
                  { value: 'Mỹ phẩm', label: 'Mỹ phẩm & Làm đẹp' },
                  { value: 'Thời trang', label: 'Thời trang' },
                  { value: 'Điện tử', label: 'Điện tử & Gia dụng' },
                  { value: 'Thể thao', label: 'Thể thao & Du lịch' },
                ]}
              />
            </Col>
            {searchMutation.data?.provider && (
              <Col>
                <Tag color="blue">Model: {searchMutation.data.provider}</Tag>
              </Col>
            )}
          </Row>
        </Space>
      </Card>

      <Card
        title={
          <Space>
            <span>Kết quả tìm kiếm AI</span>
            {searchMutation.isSuccess && (
              <Tag color="cyan">{results.length} sản phẩm phù hợp</Tag>
            )}
          </Space>
        }
        style={{ borderRadius: 12 }}
      >
        {searchMutation.isPending ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin size="large" tip="Đang vector hóa câu hỏi và tìm kiếm..." />
          </div>
        ) : results.length > 0 ? (
          <Row gutter={[16, 16]}>
            {results.map((item) => (
              <Col xs={24} sm={12} lg={8} key={item.productId}>
                <Card
                  hoverable
                  style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    borderRadius: 12,
                    border: '1px solid #e2e8f0',
                  }}
                  bodyStyle={{ padding: 16 }}
                >
                  <Space direction="vertical" size={10} style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      {item.category && <Tag color="geekblue">{item.category}</Tag>}
                      <div style={{ width: 80 }}>
                        <Progress
                          percent={Math.round(item.score * 100)}
                          size="small"
                          strokeColor="#6366f1"
                          format={(percent) => `${percent}%`}
                        />
                      </div>
                    </div>

                    <Title level={5} style={{ margin: 0, fontSize: 16 }}>
                      {item.title}
                    </Title>

                    <Space wrap size={4}>
                      {item.brand && <Tag>{item.brand}</Tag>}
                      {item.seller && (
                        <Tag icon={<ShopOutlined />}>{item.seller}</Tag>
                      )}
                      {item.ratingAvg !== null && item.ratingAvg !== undefined && (
                        <Tag color="gold" icon={<StarFilled />}>
                          {item.ratingAvg.toFixed(1)} ({item.reviewCount ?? 0})
                        </Tag>
                      )}
                    </Space>

                    {(item.priceMin || item.priceMax) && (
                      <Text strong style={{ color: '#059669', fontSize: 15 }}>
                        {item.priceMin?.toLocaleString('vi-VN')} ₫
                        {item.priceMax && item.priceMax !== item.priceMin
                          ? ` - ${item.priceMax.toLocaleString('vi-VN')} ₫`
                          : ''}
                      </Text>
                    )}

                    {item.matchedFields.length > 0 && (
                      <Space size={4} wrap>
                        <Text type="secondary" style={{ fontSize: 12 }}>Khớp qua:</Text>
                        {item.matchedFields.map((field) => (
                          <Tag color="purple" key={field} style={{ fontSize: 11 }}>
                            {field}
                          </Tag>
                        ))}
                      </Space>
                    )}

                    {item.explanation && (
                      <Alert
                        message={item.explanation}
                        type="info"
                        showIcon
                        icon={<CheckCircleOutlined style={{ color: '#6366f1' }} />}
                        style={{ fontSize: 12, padding: '6px 10px', borderRadius: 8 }}
                      />
                    )}
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        ) : searchMutation.isSuccess ? (
          <Empty description="Không tìm thấy sản phẩm phù hợp với truy vấn của bạn." />
        ) : (
          <Empty description="Nhập câu hỏi tìm kiếm ở trên để xem kết quả semantic search." />
        )}
      </Card>
    </Space>
  );
}
