import { Card, Col, Row, Typography, Space, Progress, Button } from 'antd';
import {
  ShoppingOutlined,
  CommentOutlined,
  ShopOutlined,
  RobotOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart,
  Area,
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
import { MetricCard } from '@/shared/components/MetricCard';
import { StatusTag } from '@/shared/components/StatusTag';
import { CoreTable } from '@/shared/components/CoreTable';
import { formatNumber, formatCurrency } from '@/shared/utils/formatters';
import { ROUTES } from '@/shared/constants/routes.constants';

// Recharts Mock Data
const monthlyData = [
  { month: 'Tháng 1', revenue: 450000000, orders: 320 },
  { month: 'Tháng 2', revenue: 620000000, orders: 480 },
  { month: 'Tháng 3', revenue: 580000000, orders: 410 },
  { month: 'Tháng 4', revenue: 890000000, orders: 670 },
  { month: 'Tháng 5', revenue: 1100000000, orders: 850 },
  { month: 'Tháng 6', revenue: 1350000000, orders: 990 },
  { month: 'Tháng 7', revenue: 1680000000, orders: 1280 },
];

const categoryData = [
  { name: 'Electronics', count: 420 },
  { name: 'Fashion', count: 350 },
  { name: 'Beauty', count: 210 },
  { name: 'Home-Living', count: 180 },
  { name: 'Sports-Outdoor', count: 120 },
];

const sentimentData = [
  { name: 'Tích cực (Positive)', value: 78, color: '#22c55e' },
  { name: 'Trung tính (Neutral)', value: 14, color: '#eab308' },
  { name: 'Tiêu cực (Negative)', value: 8, color: '#ef4444' },
];

const mockRecentActivities = [
  { key: '1', time: '10 phút trước', action: 'Import Dataset', detail: 'Tải 120 sản phẩm mới vào danh mục Electronics', user: 'Admin System', status: 'COMPLETED' },
  { key: '2', time: '25 phút trước', action: 'AI Embedding', detail: 'Tạo pgvector embedding cho 45 đánh giá sản phẩm', user: 'AI Service Worker', status: 'COMPLETED' },
  { key: '3', time: '1 giờ trước', action: 'Review Analysis', detail: 'Phân tích Sentiment & trích xuất chủ đề danh mục Beauty', user: 'AI Service Worker', status: 'RUNNING' },
  { key: '4', time: '2 giờ trước', action: 'Text-to-SQL Query', detail: 'Thực thi câu hỏi: "Top 5 sản phẩm bán chạy nhất tháng"', user: 'Quản trị viên', status: 'COMPLETED' },
];

export function DashboardPage() {
  const navigate = useNavigate();

  return (
    <Space direction="vertical" size={24} style={{ width: '100%' }}>
      {/* Header Bar */}
      <div style={{ background: '#ffffff', padding: '20px 24px', borderRadius: 12, border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Typography.Title level={3} style={{ margin: 0, fontWeight: 700, color: '#0f172a' }}>
            Tổng Quan Hệ Thống Marketplace
          </Typography.Title>
          <Typography.Text type="secondary" style={{ fontSize: 13, color: '#64748b' }}>
            Báo cáo tăng trưởng dữ liệu, thống kê catalog và theo dõi trạng thái AI Platform.
          </Typography.Text>
        </div>
        <Space size={12}>
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={() => navigate(ROUTES.AI_SEARCH)}
            style={{ borderRadius: 8, background: '#2563eb', fontWeight: 600 }}
          >
            Thử AI Search
          </Button>
          <Button
            icon={<RobotOutlined />}
            onClick={() => navigate(ROUTES.ANALYST_CHAT)}
            style={{ borderRadius: 8, fontWeight: 600 }}
          >
            Hỏi AI Analyst
          </Button>
        </Space>
      </div>

      {/* KPI Statistic Cards using Reusable MetricCard */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <MetricCard
            title="Tổng Sản Phẩm Catalog"
            value={formatNumber(1280)}
            icon={<ShoppingOutlined />}
            iconColor="#2563eb"
            iconBg="#eff6ff"
            trend={{ value: '12.5%', isUp: true, label: 'tuần này' }}
          />
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <MetricCard
            title="Đánh Giá (Reviews)"
            value={formatNumber(4560)}
            icon={<CommentOutlined />}
            iconColor="#16a34a"
            iconBg="#f0fdf4"
            trend={{ value: '8.3%', isUp: true, label: 'tích cực' }}
          />
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <MetricCard
            title="Sellers Hoạt Động"
            value={formatNumber(142)}
            icon={<ShopOutlined />}
            iconColor="#9333ea"
            iconBg="#faf5ff"
            subTitle="25 sellers mới tháng này"
          />
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <MetricCard
            title="AI Vector Indexing"
            value="98.5%"
            icon={<RobotOutlined />}
            iconColor="#0284c7"
            iconBg="#f0f9ff"
            subTitle="5,720 vectors pgvector"
          />
        </Col>
      </Row>

      {/* Charts Row */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card
            title={<span style={{ fontWeight: 700, color: '#0f172a' }}>Tăng Trưởng Doanh Số & Đơn Hàng</span>}
            style={{ borderRadius: 12, border: '1px solid #e2e8f0' }}
          >
            <div style={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: 12 }} />
                  <YAxis
                    stroke="#64748b"
                    style={{ fontSize: 12 }}
                    tickFormatter={(val) => `${val / 1000000}M`}
                  />
                  <Tooltip
                    formatter={(value: any) => [
                      formatCurrency(value),
                      'Doanh số',
                    ]}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#2563eb" fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title={<span style={{ fontWeight: 700, color: '#0f172a' }}>Phân Tích Sentiment Đánh Giá</span>}
            style={{ borderRadius: 12, border: '1px solid #e2e8f0', height: '100%' }}
          >
            <div style={{ height: 220, display: 'grid', placeItems: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Tỷ lệ']} />
                </PieChart>
              </ResponsiveContainer>
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

      {/* Category Breakdown & Recent Activities */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            title={<span style={{ fontWeight: 700, color: '#0f172a' }}>Phân Bổ Sản Phẩm Theo Danh Mục</span>}
            style={{ borderRadius: 12, border: '1px solid #e2e8f0' }}
          >
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" stroke="#64748b" style={{ fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" stroke="#64748b" style={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title={<span style={{ fontWeight: 700, color: '#0f172a' }}>Hoạt Động Hệ Thống & AI Worker</span>}
            style={{ borderRadius: 12, border: '1px solid #e2e8f0' }}
          >
            <CoreTable<typeof mockRecentActivities[number]>
              dataSource={mockRecentActivities}
              rowKey="key"
              pagination={false}
              size="small"
              scrollY={undefined}
              columns={[
                {
                  title: 'Hoạt động',
                  dataIndex: 'action',
                  render: (text: string, record: typeof mockRecentActivities[number]) => (
                    <div>
                      <div style={{ fontWeight: 600, color: '#0f172a', fontSize: 13 }}>{text}</div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>{record.detail}</div>
                    </div>
                  ),
                },
                {
                  title: 'Trạng thái',
                  dataIndex: 'status',
                  width: 120,
                  render: (status: string) => <StatusTag status={status} />,
                },
                {
                  title: 'Thời gian',
                  dataIndex: 'time',
                  width: 110,
                  render: (t: string) => <span style={{ fontSize: 12, color: '#94a3b8' }}>{t}</span>,
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </Space>
  );
}
