import { useQuery } from '@tanstack/react-query';
import { Alert, Card, Col, Empty, Progress, Row, Typography, Space, Button, theme } from 'antd';
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
import { useTheme } from '@/shared/theme';

function numberValue(record: AnalyticsRecord, key: string): number {
  const value = record[key];
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function stringValue(record: AnalyticsRecord, key: string): string {
  const value = record[key];
  return typeof value === 'string' ? value : String(value ?? '');
}

export function DashboardPage() {
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const { isDark } = useTheme();

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

  const categorySummary = categorySummaryQuery.data ?? [];
  const productPerformance = productPerformanceQuery.data ?? [];
  const reviewSentiment = reviewSentimentQuery.data ?? [];
  const sellerPerformance = sellerPerformanceQuery.data ?? [];

  const totalProducts = categorySummary.reduce((sum, item) => sum + numberValue(item, 'product_count'), 0);
  const totalRevenue = categorySummary.reduce((sum, item) => sum + numberValue(item, 'total_revenue'), 0);
  const totalReviews = reviewSentiment.reduce((sum, item) => sum + numberValue(item, 'review_count'), 0);
  const activeSellers = sellerPerformance.length;

  const topProducts = productPerformance
    .slice(0, 5)
    .map((item) => ({
      name: stringValue(item, 'title') || stringValue(item, 'product_id'),
      revenue: numberValue(item, 'revenue'),
      sales: numberValue(item, 'order_count'),
    }));

  const categoryData = categorySummary.map((item) => ({
    name: stringValue(item, 'name') || stringValue(item, 'category_id'),
    count: numberValue(item, 'product_count'),
    revenue: numberValue(item, 'total_revenue'),
  }));

  const sentimentTotal = reviewSentiment.reduce((sum, item) => sum + numberValue(item, 'review_count'), 0);
  const sentimentData = reviewSentiment.map((item) => {
    const label = stringValue(item, 'sentiment_label') || 'NEUTRAL';
    const count = numberValue(item, 'review_count');
    const color = label === 'POSITIVE' ? '#16a34a' : label === 'NEGATIVE' ? '#dc2626' : '#f59e0b';
    return {
      name: label,
      value: sentimentTotal > 0 ? Math.round((count / sentimentTotal) * 100) : 0,
      color,
    };
  });

  const analyticsError =
    productPerformanceQuery.error ||
    categorySummaryQuery.error ||
    reviewSentimentQuery.error ||
    sellerPerformanceQuery.error;

  const chartGridStroke = isDark ? '#334155' : '#f1f5f9';
  const tooltipContentStyle = {
    backgroundColor: token.colorBgContainer,
    borderColor: token.colorBorder,
    borderRadius: 8,
    color: token.colorText,
    boxShadow: isDark ? '0 4px 12px rgba(0,0,0,0.5)' : '0 2px 8px rgba(0,0,0,0.1)',
  };

  return (
    <Space direction="vertical" size={24} style={{ width: '100%' }}>
      <div style={{ background: token.colorBgContainer, padding: '20px 24px', borderRadius: 12, border: `1px solid ${token.colorBorder}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
        <div>
          <Typography.Title level={3} style={{ margin: 0, fontWeight: 700, color: token.colorText }}>
            Tổng Quan Hệ Thống Marketplace
          </Typography.Title>
          <Typography.Text type="secondary" style={{ fontSize: 13, color: token.colorTextSecondary }}>
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
          <MetricCard title="Tổng Sản Phẩm Catalog" value={formatNumber(totalProducts)} icon={<ShoppingOutlined />} iconColor="#2563eb" iconBg={isDark ? 'rgba(37, 99, 235, 0.2)' : '#eff6ff'} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <MetricCard title="Đánh Giá (Reviews)" value={formatNumber(totalReviews)} icon={<CommentOutlined />} iconColor="#16a34a" iconBg={isDark ? 'rgba(22, 163, 74, 0.2)' : '#f0fdf4'} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <MetricCard title="Sellers trong báo cáo" value={formatNumber(activeSellers)} icon={<ShopOutlined />} iconColor="#9333ea" iconBg={isDark ? 'rgba(147, 51, 234, 0.2)' : '#faf5ff'} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <MetricCard title="Doanh thu ghi nhận" value={formatCurrency(totalRevenue)} icon={<RobotOutlined />} iconColor="#0284c7" iconBg={isDark ? 'rgba(2, 132, 199, 0.2)' : '#f0f9ff'} subTitle="Từ analytics.category-summary" />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title={<span style={{ fontWeight: 700, color: token.colorText }}>Top Sản Phẩm Theo Doanh Thu</span>} style={{ borderRadius: 12, border: `1px solid ${token.colorBorder}` }}>
            <div style={{ height: 320 }}>
              {topProducts.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topProducts} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartGridStroke} />
                    <XAxis dataKey="name" stroke={token.colorTextSecondary} style={{ fontSize: 12 }} />
                    <YAxis stroke={token.colorTextSecondary} style={{ fontSize: 12 }} tickFormatter={(val) => `${Number(val) / 1000000}M`} />
                    <Tooltip contentStyle={tooltipContentStyle} formatter={(value) => [formatCurrency(String(value)), 'Doanh thu']} />
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
          <Card title={<span style={{ fontWeight: 700, color: token.colorText }}>Phân Bố Rating Review</span>} style={{ borderRadius: 12, border: `1px solid ${token.colorBorder}`, height: '100%' }}>
            <div style={{ height: 220, display: 'grid', placeItems: 'center' }}>
              {sentimentTotal > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={sentimentData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={5} dataKey="value">
                      {sentimentData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipContentStyle} formatter={(value) => [`${value}%`, 'Tỷ lệ']} />
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
                    <span style={{ color: token.colorText }}>{item.name}</span>
                    <span style={{ fontWeight: 700, color: token.colorText }}>{item.value}%</span>
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
          <Card title={<span style={{ fontWeight: 700, color: token.colorText }}>Phân Bổ Sản Phẩm Theo Danh Mục</span>} style={{ borderRadius: 12, border: `1px solid ${token.colorBorder}` }}>
            <div style={{ height: 260 }}>
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={chartGridStroke} />
                    <XAxis type="number" stroke={token.colorTextSecondary} style={{ fontSize: 12 }} />
                    <YAxis dataKey="name" type="category" stroke={token.colorTextSecondary} style={{ fontSize: 12 }} />
                    <Tooltip contentStyle={tooltipContentStyle} />
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
          <Card title={<span style={{ fontWeight: 700, color: token.colorText }}>Hiệu Suất Seller</span>} style={{ borderRadius: 12, border: `1px solid ${token.colorBorder}` }}>
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
