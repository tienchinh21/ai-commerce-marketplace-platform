import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Alert,
  Button,
  Card,
  Col,
  Empty,
  Progress,
  Row,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
  message,
} from 'antd';
import {
  CheckCircleOutlined,
  DislikeOutlined,
  LikeOutlined,
  PlayCircleOutlined,
  ReloadOutlined,
  SmileOutlined,
} from '@ant-design/icons';
import { DataPageHeader } from '@/shared/components/DataPageHeader';
import {
  fetchReviewAnalysisList,
  runReviewAnalysis,
} from './review-intelligence.api';
import type { ReviewAnalysisRecord } from './review-intelligence.types';

const { Text, Title } = Typography;

export function ReviewIntelligencePage() {
  const queryClient = useQueryClient();

  const {
    data: analyses = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<ReviewAnalysisRecord[]>({
    queryKey: ['review-analysis-list'],
    queryFn: fetchReviewAnalysisList,
  });

  const runAnalysisMutation = useMutation({
    mutationFn: runReviewAnalysis,
    onSuccess: (data) => {
      message.success(data.message || 'Đã hoàn tất phân tích review');
      queryClient.invalidateQueries({ queryKey: ['review-analysis-list'] });
    },
    onError: (err: Error) => {
      message.error(`Lỗi khi chạy phân tích review: ${err.message}`);
    },
  });

  const total = analyses.length;
  const positive = analyses.filter((a) => a.sentiment === 'positive').length;
  const neutral = analyses.filter((a) => a.sentiment === 'neutral').length;
  const negative = analyses.filter((a) => a.sentiment === 'negative').length;
  const positiveRate = total > 0 ? Math.round((positive / total) * 100) : 0;

  const columns = [
    {
      title: 'Review ID',
      dataIndex: 'reviewId',
      key: 'reviewId',
      width: 140,
      render: (id: string) => <Text code>{id.slice(0, 8)}...</Text>,
    },
    {
      title: 'Sentiment',
      dataIndex: 'sentiment',
      key: 'sentiment',
      width: 130,
      render: (sentiment: string) => {
        if (sentiment === 'positive')
          return <Tag color="success" icon={<LikeOutlined />}>Tích cực</Tag>;
        if (sentiment === 'negative')
          return <Tag color="error" icon={<DislikeOutlined />}>Tiêu cực</Tag>;
        return <Tag color="default" icon={<SmileOutlined />}>Trung lập</Tag>;
      },
    },
    {
      title: 'Điểm Sentiment',
      dataIndex: 'sentimentScore',
      key: 'sentimentScore',
      width: 150,
      render: (score: number) => (
        <Progress
          percent={Math.round(score * 100)}
          size="small"
          strokeColor={score >= 0.6 ? '#10b981' : score <= 0.4 ? '#ef4444' : '#f59e0b'}
          format={(p) => `${p}%`}
        />
      ),
    },
    {
      title: 'Chủ đề (Topics)',
      dataIndex: 'topics',
      key: 'topics',
      render: (topics: string[]) => (
        <Space size={4} wrap>
          {topics?.map((t) => (
            <Tag color="blue" key={t}>{t}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Điểm khen (Praises)',
      dataIndex: 'praises',
      key: 'praises',
      render: (praises: string[]) => (
        <Space size={4} wrap>
          {praises?.length > 0 ? (
            praises.map((p) => <Tag color="green" key={p}>{p}</Tag>)
          ) : (
            <Text type="secondary">-</Text>
          )}
        </Space>
      ),
    },
    {
      title: 'Điểm chê (Complaints)',
      dataIndex: 'complaints',
      key: 'complaints',
      render: (complaints: string[]) => (
        <Space size={4} wrap>
          {complaints?.length > 0 ? (
            complaints.map((c) => <Tag color="red" key={c}>{c}</Tag>)
          ) : (
            <Text type="secondary">-</Text>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <DataPageHeader
        title="Phân Tích Review AI (Review Intelligence & Sentiment Summaries)"
        description="Tự động phân tích Sentiment, trích xuất chủ đề khen/chê và tổng hợp điểm mạnh điểm yếu của từng sản phẩm."
        actions={
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => refetch()}
              loading={isLoading}
            >
              Làm mới
            </Button>
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              loading={runAnalysisMutation.isPending}
              onClick={() => runAnalysisMutation.mutate()}
              style={{ borderRadius: 8, fontWeight: 600 }}
            >
              Chạy Phân Tích Toàn Bộ
            </Button>
          </Space>
        }
      />

      {isError && (
        <Alert
          type="error"
          showIcon
          message="Không thể tải dữ liệu phân tích review"
          description={error?.message || 'Vui lòng kiểm tra dịch vụ commerce-ai-platform đang chạy.'}
        />
      )}

      <Row gutter={16}>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 12 }}>
            <Statistic
              title="Đánh giá đã phân tích"
              value={total}
              suffix="reviews"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 12 }}>
            <Statistic
              title="Tỉ lệ Tích cực"
              value={positiveRate}
              suffix="%"
              valueStyle={{ color: '#10b981' }}
              prefix={<LikeOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 12 }}>
            <Statistic
              title="Đánh giá Trung lập"
              value={neutral}
              valueStyle={{ color: '#f59e0b' }}
              prefix={<SmileOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 12 }}>
            <Statistic
              title="Đánh giá Tiêu cực"
              value={negative}
              valueStyle={{ color: '#ef4444' }}
              prefix={<DislikeOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title={
          <Space>
            <span>Chi tiết các đánh giá được phân tích gần đây</span>
            <Tag color="processing">{total} kết quả</Tag>
          </Space>
        }
        style={{ borderRadius: 12 }}
      >
        <Table
          dataSource={analyses}
          columns={columns}
          rowKey="reviewId"
          loading={isLoading}
          pagination={{ pageSize: 10, showSizeChanger: true }}
          locale={{
            emptyText: (
              <Empty description="Chưa có review nào được phân tích. Nhấn 'Chạy Phân Tích Toàn Bộ' ở trên." />
            ),
          }}
        />
      </Card>
    </Space>
  );
}
