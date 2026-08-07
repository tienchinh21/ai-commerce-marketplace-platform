import { Card, Row, Col, Tag, Progress, Space, Typography, Badge, List } from 'antd';
import { LikeOutlined, DislikeOutlined, SmileOutlined, MehOutlined, FrownOutlined } from '@ant-design/icons';
import { DataPageHeader } from '@/shared/components/DataPageHeader';

export function ReviewIntelligencePage() {
  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <DataPageHeader
        title="Phân Tích Review AI (Review Intelligence & Sentiment Summaries)"
        description="Tự động phân tích Sentiment, trích xuất chủ đề khen/chê và tổng hợp điểm mạnh điểm yếu của từng sản phẩm."
        actions={null}
      />

      <Row gutter={[20, 20]}>
        <Col span={8}>
          <Card title={<span style={{ fontWeight: 700 }}>Tỷ lệ Sentiment Toàn Sàn</span>} style={{ borderRadius: 12 }}>
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span><SmileOutlined style={{ color: '#22c55e' }} /> Tích cực (Positive)</span>
                  <strong>78%</strong>
                </div>
                <Progress percent={78} strokeColor="#22c55e" showInfo={false} />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span><MehOutlined style={{ color: '#eab308' }} /> Trung tính (Neutral)</span>
                  <strong>14%</strong>
                </div>
                <Progress percent={14} strokeColor="#eab308" showInfo={false} />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span><FrownOutlined style={{ color: '#ef4444' }} /> Tiêu cực (Negative)</span>
                  <strong>8%</strong>
                </div>
                <Progress percent={8} strokeColor="#ef4444" showInfo={false} />
              </div>
            </Space>
          </Card>
        </Col>

        <Col span={16}>
          <Card title={<span style={{ fontWeight: 700 }}>AI Summary Sản Phẩm: Tai nghe Anker Soundcore Q30</span>} style={{ borderRadius: 12 }}>
            <Row gutter={16}>
              <Col span={12}>
                <div style={{ background: '#f0fdf4', padding: 16, borderRadius: 10, border: '1px solid #bbf7d0' }}>
                  <Typography.Text strong style={{ color: '#166534', fontSize: 14 }}>
                    <LikeOutlined /> Điểm Mạnh & Lời Khen Phổ Biến (82% Khen)
                  </Typography.Text>
                  <List
                    size="small"
                    dataSource={[
                      'Khả năng chống ồn chủ động ANC rất vượt trội.',
                      'Thời lượng pin sử dụng thực tế lên đến 40 giờ.',
                      'Đệm tai êm ái, không gây đau tai khi đeo lâu.',
                    ]}
                    renderItem={(item) => <List.Item style={{ fontSize: 13, borderBottom: 0 }}>✓ {item}</List.Item>}
                  />
                </div>
              </Col>

              <Col span={12}>
                <div style={{ background: '#fef2f2', padding: 16, borderRadius: 10, border: '1px solid #fecaca' }}>
                  <Typography.Text strong style={{ color: '#991b1b', fontSize: 14 }}>
                    <DislikeOutlined /> Điểm Yếu & Khiếu Nại Phổ Biến (18% Chê)
                  </Typography.Text>
                  <List
                    size="small"
                    dataSource={[
                      'Micro đàm thoại khi ra đường hơi bị thu tiếng gió.',
                      'Hộp đựng tai nghe khá to khi bỏ vào balo nhỏ.',
                    ]}
                    renderItem={(item) => <List.Item style={{ fontSize: 13, borderBottom: 0 }}>✗ {item}</List.Item>}
                  />
                </div>
              </Col>
            </Row>

            <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid #f1f5f9' }}>
              <Badge color="purple" text="Chân dung khách hàng phù hợp: Dân văn phòng, người thường xuyên đi máy bay, sinh viên học tập cần không gian yên tĩnh." />
            </div>
          </Card>
        </Col>
      </Row>
    </Space>
  );
}
