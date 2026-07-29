import { Card, Col, Row, Statistic, Typography, Table, Tag, Space, Progress, Button } from 'antd';
import {
  ShoppingOutlined,
  CommentOutlined,
  ShopOutlined,
  RobotOutlined,
  ArrowUpOutlined,
  CloudServerOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

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
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
          borderRadius: 16,
          padding: '28px 32px',
          color: '#fff',
          boxShadow: '0 10px 25px -5px rgba(67, 56, 202, 0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <Typography.Title level={2} style={{ color: '#fff', margin: 0, fontWeight: 700 }}>
            Chào mừng trở lại, Quản trị viên! 👋
          </Typography.Title>
          <Typography.Text style={{ color: '#c7d2fe', fontSize: 14 }}>
            Hệ thống Marketplace Core & Nền tảng AI đang hoạt động ổn định ở Phase 1.
          </Typography.Text>
        </div>
        <Space size={12}>
          <Button
            type="primary"
            icon={<SearchOutlined />}
            size="large"
            onClick={() => navigate('/ai-search')}
            style={{ borderRadius: 8, background: '#6366f1', borderColor: '#6366f1', fontWeight: 600 }}
          >
            Thử AI Search
          </Button>
          <Button
            icon={<RobotOutlined />}
            size="large"
            onClick={() => navigate('/analyst-chat')}
            style={{ borderRadius: 8, background: 'rgba(255,255,255,0.15)', color: '#fff', border: 0, fontWeight: 600 }}
          >
            Hỏi AI Analyst
          </Button>
        </Space>
      </div>

      {/* KPI Statistic Cards */}
      <Row gutter={[20, 20]}>
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
              <div style={{ width: 44, height: 44, borderRadius: 10, background: '#e0e7ff', color: '#4f46e5', display: 'grid', placeItems: 'center', fontSize: 20 }}>
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
                <Tag color="purple" style={{ borderRadius: 10, border: 0 }}>
                  5 Danh mục chính
                </Tag>
              </div>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: '#faf5ff', color: '#9333ea', display: 'grid', placeItems: 'center', fontSize: 20 }}>
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

      {/* Main Grid Content */}
      <Row gutter={[20, 20]}>
        {/* Recent Activities */}
        <Col xs={24} lg={16}>
          <Card
            title={<span style={{ fontWeight: 700, fontSize: 16 }}>Nhật ký hoạt động hệ thống</span>}
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
                  render: (text) => <span style={{ color: '#64748b', fontSize: 13 }}>{text}</span>,
                },
                {
                  title: 'Thao tác',
                  dataIndex: 'action',
                  render: (text) => <Tag color="blue" style={{ fontWeight: 600 }}>{text}</Tag>,
                },
                {
                  title: 'Chi tiết',
                  dataIndex: 'detail',
                },
                {
                  title: 'Thực hiện',
                  dataIndex: 'user',
                  render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
                },
                {
                  title: 'Trạng thái',
                  dataIndex: 'status',
                  render: (status) => <Tag color="green" icon={<CheckCircleOutlined />}>HOÀN THÀNH</Tag>,
                },
              ]}
            />
          </Card>
        </Col>

        {/* AI System Health & Services */}
        <Col xs={24} lg={8}>
          <Card
            title={<span style={{ fontWeight: 700, fontSize: 16 }}>Trạng thái Hạ tầng & AI Services</span>}
            style={{ borderRadius: 12, border: '1px solid #e2e8f0' }}
          >
            <Space direction="vertical" size={20} style={{ width: '100%' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <Typography.Text strong style={{ fontSize: 13 }}>Core Spring Boot API</Typography.Text>
                  <Tag color="success">Hoạt động</Tag>
                </div>
                <Progress percent={100} size="small" status="active" strokeColor="#22c55e" />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <Typography.Text strong style={{ fontSize: 13 }}>AI Platform NestJS API</Typography.Text>
                  <Tag color="success">Hoạt động</Tag>
                </div>
                <Progress percent={98} size="small" strokeColor="#6366f1" />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <Typography.Text strong style={{ fontSize: 13 }}>PostgreSQL + pgvector DB</Typography.Text>
                  <Tag color="success">Kết nối</Tag>
                </div>
                <Progress percent={100} size="small" strokeColor="#3b82f6" />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <Typography.Text strong style={{ fontSize: 13 }}>Redis Queue / MinIO Storage</Typography.Text>
                  <Tag color="processing">Sẵn sàng</Tag>
                </div>
                <Progress percent={100} size="small" strokeColor="#a855f7" />
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </Space>
  );
}
