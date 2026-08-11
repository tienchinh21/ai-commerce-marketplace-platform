import { useQuery } from '@tanstack/react-query';
import { Alert, Card, Col, Empty, Progress, Row, Typography, Space, Button } from 'antd';
import {
  ShoppingOutlined,
  CommentOutlined,
  ShopOutlined,
  RobotOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { fetchCategorySummary, fetchProductPerformance, fetchReviewSentiment, fetchSellerPerformance } from '@/modules/analytics/analytics.api';
import type { AnalyticsRecord } from '@/modules/analytics/analytics.types';
import { MetricCard } from '@/shared/components/MetricCard';
import { StatusTag } from '@/shared/components/StatusTag';
import { CoreTable } from '@/shared/components/CoreTable';
import { extractErrorMessage } from '@/shared/utils/error-handler';
import { formatNumber, formatCurrency } from '@/shared/utils/formatters';
import { ROUTES } from '@/shared/constants/routes.constants';

function numberValue(record: AnalyticsRecord, key: string): number {
  const value = record[key];
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function stringValue(record: AnalyticsRecord, key: string, fallback = '-'): string {
  const value = record[key];
  return typeof value === 'string' && value ? value : fallback;
}

export function DashboardPage() {
  const navigate = useNavigate();

  const productPerformanceQuery = useQuery({
    queryKey: ['cms-analytics-product-performance', 8],
    queryFn: () => fetchProductPerformance({ limit: 8 }),
  });
  const categorySummaryQuery = useQuery({
    queryKey: ['cms-analytics-category-summary'],
    queryFn: () => fetchCategorySummary(),
  });
  const reviewSentimentQuery = useQuery({
    queryKey: ['cms-analytics-review-sentiment'],
    queryFn: () => fetchReviewSentiment(),
  });
  const sellerPerformanceQuery = useQuery({
    queryKey: ['cms-analytics-seller-performance', 8],
    queryFn: () => fetchSellerPerformance({ limit: 8 }),
  });

  const analyticsError =
    productPerformanceQuery.error ??
    categorySummaryQuery.error ??
    reviewSentimentQuery.error ??
    sellerPerformanceQuery.error;

  const productPerformance = productPerformanceQuery.data ?? [];
  const categorySummary = categorySummaryQuery.data ?? [];
  const sellerPerformance = sellerPerformanceQuery.data ?? [];
  const totalProducts = categorySummary.reduce((sum, item) => sum + numberValue(item, 'product_count'), 0);
  const totalReviews = categorySummary.reduce((sum, item) => sum + numberValue(item, 'review_count'), 0);
  const activeSellers = sellerPerformance.filter((seller) => stringValue(seller, 'status') === 'ACTIVE').length;
  const totalRevenue = categorySummary.reduce((sum, item) => sum + numberValue(item, 'revenue'), 0);

  const topProducts = productPerformance.map((item) => ({
    name: stringValue(item, 'title'),
    revenue: numberValue(item, 'revenue'),
    orders: numberValue(item, 'order_count'),
  }));

  const categoryData = categorySummary.map((item) => ({
    name: stringValue(item, 'name'),
    count: numberValue(item, 'product_count'),
  }));

  const ratingCounts = (reviewSentimentQuery.data ?? []).reduce<{ positive: number; neutral: number; negative: number }>(
    (acc, item) => {
      const rating = numberValue(item, 'rating');
      const count = numberValue(item, 'review_count');
      if (rating >= 4) acc.positive += count;
      else if (rating >= 3) acc.neutral += count;
      else acc.negative += count;
      return acc;
    },
    { positive: 0, neutral: 0, negative: 0 },
  );
  const sentimentTotal = ratingCounts.positive + ratingCounts.neutral + ratingCounts.negative;
  const sentimentData = [
    { name: 'Tích cực', value: sentimentTotal ? Math.round((ratingCounts.positive / sentimentTotal) * 100) : 0, color: '#22c55e' },
    { name: 'Trung tính', value: sentimentTotal ? Math.round((ratingCounts.neutral / sentimentTotal) * 100) : 0, color: '#eab308' },
    { name: 'Tiêu cực', value: sentimentTotal ? Math.round((ratingCounts.negative / sentimentTotal) * 100) : 0, color: '#ef4444' },
  ];

  return (
    <Space direction="vertical" size={24} style={{ width: '100%' }}>
      <div style={{ background: '#ffffff', padding: '20px 24px', borderRadius: 12, border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
        <div>
          <Typography.Title level={3} style={{ margin: 0, fontWeight: 700, color: '#0f172a' }}>
            Tổng Quan Hệ Thống Marketplace
          </Typography.Title>
          <Typography.Text type="secondary" style={{ fontSize: 13, color: '#64748b' }}>
            Báo cáo catalog, doanh thu, review và seller từ Core Analytics API.
          </Typography.Text>
        </div>
        <Space size={12}>
          <Button type="primary" icon={<SearchOutlined />} onClick={() => navigate(ROUTES.AI_SEARCH)} style={{ borderRadius: 8, background: '#2563eb', fontWeight: 600 }}>
            Thử AI Search
          </Button>
          <Button icon={<RobotOutlined />} onClick={() => navigate(ROUTES.ANALYST_CHAT)} style={{ borderRadius: 8, fontWeight: 600 }}>
            Hỏi AI Analyst
          </Button>
        </Space>
      </div>

      {analyticsError && (
        <Alert type="warning" showIcon message="Không tải được một phần dữ liệu analytics" description={extractErrorMessage(analyticsError)} />
      )}

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <MetricCard title="Tổng Sản Phẩm Catalog" value={formatNumber(totalProducts)} icon={<ShoppingOutlined />} iconColor="#2563eb" iconBg="#eff6ff" />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <MetricCard title="Đánh Giá (Reviews)" value={formatNumber(totalReviews)} icon={<CommentOutlined />} iconColor="#16a34a" iconBg="#f0fdf4" />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <MetricCard title="Sellers trong báo cáo" value={formatNumber(activeSellers)} icon={<ShopOutlined />} iconColor="#9333ea" iconBg="#faf5ff" />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <MetricCard title="Doanh thu ghi nhận" value={formatCurrency(totalRevenue)} icon={<RobotOutlined />} iconColor="#0284c7" iconBg="#f0f9ff" subTitle="Từ analytics.category-summary" />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title={<span style={{ fontWeight: 700, color: '#0f172a' }}>Top Sản Phẩm Theo Doanh Thu</span>} style={{ borderRadius: 12, border: '1px solid #e2e8f0' }}>
            <div style={{ height: 320 }}>
              {topProducts.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topProducts} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: 12 }} />
                    <YAxis stroke="#64748b" style={{ fontSize: 12 }} tickFormatter={(val) => `${Number(val) / 1000000}M`} />
                    <Tooltip formatter={(value) => [formatCurrency(String(value)), 'Doanh thu']} />
                    <Bar dataKey="revenue" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Empty description="Chưa có dữ liệu doanh thu sản phẩm." />
              )}
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title={<span style={{ fontWeight: 700, color: '#0f172a' }}>Phân Bố Rating Review</span>} style={{ borderRadius: 12, border: '1px solid #e2e8f0', height: '100%' }}>
            <div style={{ height: 220, display: 'grid', placeItems: 'center' }}>
              {sentimentTotal > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={sentimentData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={5} dataKey="value">
                      {sentimentData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Tỷ lệ']} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Empty description="Chưa có review được duyệt." />
              )}
            </div>
            <div style={{ marginTop: 12 }}>
              {sentimentData.map((item) => (
                <div key={item.name} style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <span>{item.name}</span>
                    <span style={{ fontWeight: 700 }}>{item.value}%</span>
                  </div>
                  <Progress percent={item.value} strokeColor={item.color} showInfo={false} size="small" />
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title={<span style={{ fontWeight: 700, color: '#0f172a' }}>Phân Bổ Sản Phẩm Theo Danh Mục</span>} style={{ borderRadius: 12, border: '1px solid #e2e8f0' }}>
            <div style={{ height: 260 }}>
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" stroke="#64748b" style={{ fontSize: 12 }} />
                    <YAxis dataKey="name" type="category" stroke="#64748b" style={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Empty description="Chưa có dữ liệu danh mục." />
              )}
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title={<span style={{ fontWeight: 700, color: '#0f172a' }}>Hiệu Suất Seller</span>} style={{ borderRadius: 12, border: '1px solid #e2e8f0' }}>
            <CoreTable<AnalyticsRecord>
              dataSource={sellerPerformance}
              rowKey={(record) => stringValue(record, 'id')}
              pagination={false}
              size="small"
              scrollY={undefined}
              columns={[
                { title: 'Seller', dataIndex: 'name', render: (name: string) => <strong>{name}</strong> },
                { title: 'Sản phẩm', dataIndex: 'product_count', render: formatNumber },
                { title: 'Đơn', dataIndex: 'order_count', render: formatNumber },
                { title: 'Doanh thu', dataIndex: 'revenue', render: formatCurrency },
                { title: 'Trạng thái', dataIndex: 'status', render: (status: string) => <StatusTag status={status} /> },
              ]}
              locale={{ emptyText: 'Chưa có dữ liệu seller performance.' }}
            />
          </Card>
        </Col>
      </Row>
    </Space>
  );
}
