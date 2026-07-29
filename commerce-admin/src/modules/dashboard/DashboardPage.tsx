import { Card, Col, Row, Statistic, Typography, Table, Tag, Space, Progress, Button } from 'antd';
import {
  ShoppingOutlined,
  CommentOutlined,
  ShopOutlined,
  RobotOutlined,
  ArrowUpOutlined,
  CheckCircleOutlined,
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
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Recharts Mock Data
const monthlyData = [
  { month: 'Tháng 1', revenue: 450, orders: 320 },
  { month: 'Tháng 2', revenue: 620, orders: 480 },
  { month: 'Tháng 3', revenue: 580, orders: 410 },
  { month: 'Tháng 4', revenue: 890, orders: 670 },
  { month: 'Tháng 5', revenue: 1100, orders: 850 },
  { month: 'Tháng 6', revenue: 1350, orders: 990 },
  { month: 'Tháng 7', revenue: 1680, orders: 1280 },
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
  { key: '3', time: '1 giờ trước', action: 'Review Analysis', detail: 'Phân tích Sentiment & trích xuất chủ đề danh mục Beauty', user: 'AI Service Worker', status: 'COMPLETED' },
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
            onClick={() => navigate('/ai-search')}
            style={{ borderRadius: 8, background: '#2563eb', fontWeight: 600 }}
          >
            Thử AI Search
          </Button>
          <Button
            icon={<RobotOutlined />}
            onClick={() => navigate('/analyst-chat')}
            style={{ borderRadius: 8, fontWeight: 600 }}
          >
            Hỏi AI Analyst
          </Button>
        </Space>
      </div>

      {/* KPI Statistic Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 12, border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <Typography.Text type="secondary" style={{ fontSize: 13, fontWeight: 500 }}>
                  Tổng Sản Phẩm Catalog
                </Typography.Text>
                <Typography.Title level={2} style={{ margin: '8px 0 4px', fontWeight: 700 }}>
                  1,280
                </Typography.Title>
                <Tag color="success" style={{ borderRadius: 10, border: 0 }}>
                  <ArrowUpOutlined /> +12.5% tuần này
                </Tag>
              </div>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: '#eff6ff', color: '#2563eb', display: 'grid', placeItems: 'center', fontSize: 20 }}>
                <ShoppingOutlined />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 12, border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <Typography.Text type="secondary" style={{ fontSize: 13, fontWeight: 500 }}>
                  Đánh Giá (Reviews)
                </Typography.Text>
                <Typography.Title level={2} style={{ margin: '8px 0 4px', fontWeight: 700 }}>
                  4,560
                </Typography.Title>
                <Tag color="processing" style={{ borderRadius: 10, border: 0 }}>
                  <ArrowUpOutlined /> +8.3% tích cực
                </Tag>
              </div>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: '#f0fdf4', color: '#16a34a', display: 'grid', placeItems: 'center', fontSize: 20 }}>
                <CommentOutlined />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 12, border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <Typography.Text type="secondary" style={{ fontSize: 13, fontWeight: 500 }}>
                  Nhà Bán Hàng (Sellers)
                </Typography.Text>
                <Typography.Title level={2} style={{ margin: '8px 0 4px', fontWeight: 700 }}>
                  85
                </Typography.Title>
                <Tag color="blue" style={{ borderRadius: 10, border: 0 }}>
                  5 Danh mục chính
                </Tag>
              </div>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: '#f8fafc', color: '#475569', display: 'grid', placeItems: 'center', fontSize: 20 }}>
                <ShopOutlined />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 12, border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <Typography.Text type="secondary" style={{ fontSize: 13, fontWeight: 500 }}>
                  Tác Vụ AI Indexing
                </Typography.Text>
                <Typography.Title level={2} style={{ margin: '8px 0 4px', fontWeight: 700 }}>
                  99.4%
                </Typography.Title>
                <Tag color="cyan" style={{ borderRadius: 10, border: 0 }}>
                  pgvector ready
                </Tag>
              </div>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: '#ecfeff', color: '#0891b2', display: 'grid', placeItems: 'center', fontSize: 20 }}>
                <RobotOutlined />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Interactive Charts Section */}
      <Row gutter={[20, 20]}>
        {/* Revenue & Orders Trend Area Chart */}
        <Col xs={24} lg={16}>
          <Card title={<span style={{ fontWeight: 700, fontSize: 16 }}>Biểu đồ Tăng Trưởng Doanh Thu & Đơn Hàng</span>} style={{ borderRadius: 12, border: '1px solid #e2e8f0' }}>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16a34a" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="revenue" name="Doanh thu (triệu ₫)" stroke="#2563eb" fillOpacity={1} fill="url(#colorRevenue)" />
                  <Area type="monotone" dataKey="orders" name="Số đơn hàng" stroke="#16a34a" fillOpacity={1} fill="url(#colorOrders)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Review Sentiment Donut Chart */}
        <Col xs={24} lg={8}>
          <Card title={<span style={{ fontWeight: 700, fontSize: 16 }}>Phân Bổ Sentiment Đánh Giá AI</span>} style={{ borderRadius: 12, border: '1px solid #e2e8f0' }}>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Category Bar Chart & Activity Table */}
      <Row gutter={[20, 20]}>
        {/* Products by Category Bar Chart */}
        <Col xs={24} lg={12}>
          <Card title={<span style={{ fontWeight: 700, fontSize: 16 }}>Phân Bổ Sản Phẩm Theo Danh Mục</span>} style={{ borderRadius: 12, border: '1px solid #e2e8f0' }}>
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="count" name="Số lượng SKU" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Recent Activities */}
        <Col xs={24} lg={12}>
          <Card
            title={<span style={{ fontWeight: 700, fontSize: 16 }}>Nhật ký hoạt động gần đây</span>}
            extra={<a onClick={() => navigate('/ingestion')}>Xem tất cả</a>}
            style={{ borderRadius: 12, border: '1px solid #e2e8f0' }}
          >
            <Table
              pagination={false}
              dataSource={mockRecentActivities}
              columns={[
                {
                  title: 'Thời gian',
                  dataIndex: 'time',
                  render: (text) => <span style={{ color: '#64748b', fontSize: 12 }}>{text}</span>,
                },
                {
                  title: 'Thao tác',
                  dataIndex: 'action',
                  render: (text) => <Tag color="blue" style={{ fontWeight: 600 }}>{text}</Tag>,
                },
                {
                  title: 'Chi tiết',
                  dataIndex: 'detail',
                  ellipsis: true,
                },
                {
                  title: 'Trạng thái',
                  dataIndex: 'status',
                  render: () => <Tag color="green" icon={<CheckCircleOutlined />}>HOÀN THÀNH</Tag>,
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </Space>
  );
}
